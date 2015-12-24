var app = require('express')();
var http = require('http').Server(app);
//var port = process.env.PORT || 2015;
var port = 2015;
var io = require('socket.io')(http);
var fs = require('fs');
var constant = require('./Configs/Constant.js');

var RoomManager = require('./Managers/roommanager.js');
var UserManager = require('./Managers/usermanager.js');
var roomMng = new RoomManager();
var userMng = new UserManager();

var Message = require('./Entities/message.js');
var Room = require('./Entities/room.js');

var Connection = require('./Connectors/connection.js');
var conn = new Connection();
var SignUp = require('./Components/SignUp.js');
var signup = new SignUp();
var Login = require('./Components/Login.js');
var login = new Login();
var Question = require('./Entities/question.js');
var AppUltis = require('./Ultis/appultis.js');
var appultis = new AppUltis();
var base64 = require('base-64');
var _redis = require('redis');
var redis = undefined;
var math = require('math');
var underscore = require('underscore');

var arrMoney = [
    200000, 400000, 600000, 1000000, 2000000,
    3000000, 6000000, 10000000, 14000000, 22000000,
    30000000, 40000000, 60000000, 85000000, 150000000
];

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

require('events').EventEmitter.prototype._maxListeners = 1000;

io.on(global.client_connect, function (client) {
    console.log('a user connected');
    userMng.initUser(client);
    
    client.on(global.client_disconnect, function () {
        userMng.getUserById(client.id, function (user) {
            if (user != undefined) {
                user.startTimeout(function () {
                    userMng.removeUser(user);
                    console.log('a user disconnected: ' + client.id);
                    console.log('Concurrecy number: %s', userMng.getConcurency());
                });
            }
            else {
                console.log('user disconnect not found!');
            }
        });
    });
    
    client.on(global.client_message, function (msg) {
        var jsonData = (msg);
        var command = jsonData['command'];
        console.log(command);
        switch (command) {
            case global.client_signup_name:
                var username = jsonData['username'];
                clientSignup(username, password, client);
                break;
            case global.client_signup:
                var username = jsonData['username'];
                var password = jsonData['password'];
                clientSignup(username, password, client);
                break;
            case global.client_login:
                var username = jsonData['username'];
                var password = jsonData['password'];
                console.log(jsonData);
                clientLogin(username, password, client);
                //---
                //client.emit('server.list.room', roomMng.getListRoomJson());
                break;
            case global.client_choose_game:
                break;
            case global.client_choose_room:
                clientChooseRoom(client, msg);
                break;
            case global.client_get_question:
                console.log(jsonData);
                var level = jsonData['level'];
                clientGetQuestion(client, level);
                break;
            case global.client_answer:
                console.log(jsonData);
                var answer = jsonData['answer'];
                var questionId = jsonData['questionId'];
                clientAnswer(client, questionId, answer);
                break;
            case global.client_get_listroom:
                var listRoom = roomMng.getListRoomJson();
                console.log(listRoom);
                client.emit(global.server_send_listroom, listRoom);
                break;
            case global.client_ready_to_room:
                clientReady(client, msg);
                break;
            case global.client_answer_to_room:
                var answer = jsonData['answer'];
                var questionId = jsonData['questionId'];
                var answerContent = jsonData['answer_content'];
                var duration = jsonData['duration'];
                var answerCase = jsonData['answer_case'];
                var level = parseInt(jsonData['level']);
                console.log(jsonData);
                clientAnswerToRoom(client, questionId, answerContent, level, answer, duration, msg, answerCase);
                break;
            case global.client_time_out_to_room:
                break;
            case global.client_get_record:
                clientGetRecord(client);
                break;
            case global.client_save_record:
                console.log(jsonData);
                var money = jsonData['money'];
                var name = jsonData['username'];
                clientSaveRecord(name, money, client);
                break;
            case global.client_reconnect:
                var idQuestion = jsonData['questionId'];
                var level = jsonData['level'];
                var username = jsonData['username'];
                var roomId = jsonData['roomId'];
                console.log(jsonData);
                clientReconnect(idQuestion, level, username, roomId, client);
                break;
            case global.client_leave_room:
                var roomId = jsonData['roomId'];
                clientLeaveRoom(roomId, client);
                break;
            default:
                break;
        }
        console.log('Concurrecy number: %s', userMng.getConcurency());
    });
});

function clientSignup(username, password, client) {
    signup.checkUserExist(username, function (row) {
        var data = {};
        data.username = username;
        if (underscore.isEmpty(row)) {
            //new user
            signup.excuteSignup(username, password, function (row) {
                if (row != undefined) {
                    data.status = true;
                    data.message = 'Signup success.';
                    client.emit(global.server_send_confirm_signup, data)
                }
                else {
                    data.status = false;
                    data.message = 'Error while sungup, please try again.';
                    client.emit(global.server_send_confirm_signup, data)
                }
            });
        }
        else {
            //user exist
            data.status = false;
            data.message = 'Username has exist, please choose other.';
            client.emit(global.server_send_confirm_signup, data)
        }
    });
}

function clientLogin(username, password, client) {
    login.excuteLogin(username, password, function (status) {
        var message = { status: status };
        if (status) {
            userMng.setUserName(client.id, username);
            message.message = 'Login success...';
        }
        else {
            message.message = 'Login fail...';
        }
        client.emit(global.server_confirm_login, message);
    });
}

function clientChooseRoom(client, data) {
    var roomId = data['roomId'];
    userMng.getUserById(client.id, function (user) {
        if (user != undefined) {
            user.setRoom(roomId);
            
            var messageToClient;
            var listUserInRoom = userMng.getListUserByRoomId(roomId);
            if (listUserInRoom.length == 1)
                messageToClient = 'Welcome to ALTP';
            else
                messageToClient = user.getName() + ' has joined room, let start';
            
            var mess = {
                username_new_client: user.getName(),
                message: messageToClient,
                number_player: listUserInRoom.length,
                room_id: roomId
            }
            userMng.sendMessageToListUser(io, global.server_send_client_join_room, mess, listUserInRoom);
        };
    });
}

function clientReady(client, data) {
    try {
        var roomId = data['roomId'];
        var level = data['level'];
        userMng.getUserById(client.id, function (user) {
            if (user.getReady())
                return;
            user.setReady(true);
            var listUserInRoom = userMng.getListUserByRoomId(roomId);
            var numberPlayerInRoom = appultis.getNumberUserReady(listUserInRoom);
            
            console.log('====================number player ready in room : ' + numberPlayerInRoom + '==========================');
            
            if (numberPlayerInRoom == (global.max_player_in_room)) {
                startGame(listUserInRoom, io, level);
            }
            else {
                var data = {
                    status: true,
                    message: 'You are ready! waiting for new player'
                }
                client.emit(global.server_to_room_confirm_ready, data);
            }
        });
    }
    catch (ex) {
        console.log(ex);
    }
}

function clientGetQuestion(client, level) {
    appultis.getQuestion(level, redis, function (question) {
        client.emit(global.server_send_question, question);
    });
}

function clientAnswer(client, questionId, answer) {
    var query = 'SELECT casea FROM `ninequestions` where id = ?';
    conn.excuteUpdate(query, [questionId], function (row) {
        var casea = row[0]['casea'];
        if (casea == answer) {
            var result = {
                result: true
            }
            client.emit(global.server_confirm_answer, result);
        }
        else {
            var result = {
                result: false
            }
            client.emit(global.server_confirm_answer, result);
        }
    });
}

function startGame(listUser, io, level) {
    console.log('start game');
    var dataStart = {
        status: true,
        message: 'All player are ready, let\'s play game'
    }
    userMng.sendMessageToListUser(io, global.server_to_room_start_game, dataStart, listUser);
    
    setTimeout(function () {
        sendQuestionToRoom(level, listUser, io)
    }, 500);
}

function sendQuestionToRoom(level, listUser, io) {
    level = parseInt((level - 1) / 5) + 1;
    var query = 'SELECT * FROM ninequestions where level = ? ORDER BY rand() LIMIT 1';
    conn.excuteUpdate(query, [level], function (row) {
        var question = new Question();
        question.loadQuestionNormal(row);
        console.log(question);
        userMng.sendMessageToListUser(io, global.server_to_room_send_question, question, listUser);
        for (var i = 0; i < listUser.length; i++) {
            var user = listUser[i];
            if (user != undefined) {
                user.setIsPlaying(true);
            }
        }
        console.log('send question to room');
    });
}

function clientAnswerToRoom(client, questionId, answerContent, level, answer, duration, data, answerCase) {
    userMng.getUserById(client.id, function (user) {
        user.setDuration(duration);
        user.setAnswer(answer);
        user.setAnswerCase(answerCase);
        user.setQuestionId(questionId);
        user.setAnswerContent(answerContent);
        
        var roomId = data['roomId'];
        var listUserInRoom = userMng.getListUserByRoomId(roomId);
        
        var numberPlayerAnswer = appultis.getNumberUserAnswer(listUserInRoom);
        
        if (numberPlayerAnswer == global.max_player_in_room) {
            setTimeout(function () {
                finishQuestion(listUserInRoom, level)
            }, 8000);
        }
    });
}

function finishMatch(listUserInRoom, level) {
    try {
        var dataFinishMatch = [];
        for (var i = 0; i < listUserInRoom.length; i++) {
            var user = listUserInRoom[i];
            var dataUser = {
                player_name: user.getName(),
                average_response_time: 10,
                total_money: user.getMoneyTotalInMatch()
            }
            dataFinishMatch[i] = dataUser;
        }
        var data = {
            level: level,
            data_finish : dataFinishMatch
        }
        console.log(data);
        userMng.sendMessageToListUser(io, global.server_to_room_send_finish_match, data, listUserInRoom);
        
        for (var i = 0; i < listUserInRoom.length; i++) {
            var user = listUserInRoom[i];
            if (user != undefined) {
                user.reset();
            }
        }
    }
    catch (ex) {
        console.log(ex);
    }
}

function finishQuestion(listUserInRoom, level) {
    //sap xep tu thap den cao
    listUserInRoom.sort(function (a, b) {
        return a.getDuration() - b.getDuration();
    });
    //dao nguoc cho cao nhat len dau
    listUserInRoom.reverse();
    var data = [];
    var userFirst = listUserInRoom[0];
    var questionId;
    var rightAnswer;
    if (userFirst != undefined) {
        questionId = userFirst.getQuestionId();
        var query = 'SELECT casea FROM `ninequestions` where id = ?';
        conn.excuteUpdate(query, [questionId], function (row) {
            rightAnswer = row[0]['casea'];
            
            var numberUserAnswerRight = appultis.getNumberUserAnswerRight(listUserInRoom, rightAnswer);
            for (var i = 0; i < listUserInRoom.length; i++) {
                var user = listUserInRoom[i];
                var u = {
                    name: user.getName(),
                    answer_case: user.getAnswerCase(),                
                    duration: global.time_answer_question - user.getDuration(),
                    answer_content: user.getAnswerContent(),
                    money: 0
                }
                if (user.getAnswer() == rightAnswer) {
                    if (user.getDuration() == userFirst.getDuration()) {
                        u.money = arrMoney[level] / numberUserAnswerRight;
                        u.isWin = true;
                    }
                    else {
                        u.money = 0;
                        u.isWin = false;
                    }
                }
                else {
                    u.money = 0;
                    u.isWin = false;
                }
                user.setMoneyTotalInMatch(parseInt(u.money));
                u.total_money = user.getMoneyTotalInMatch();
                data[i] = u;
                user.setReady(false);
            }
            
            var dataFinish = {
                data_finish: data
            }
            
            console.log(dataFinish);
            userMng.sendMessageToListUser(io, global.server_to_room_send_finish_question, dataFinish, listUserInRoom);
            
            //finish match
            if (parseInt(level) == global.max_number_question_in_room) {
                setTimeout(function () {
                    finishMatch(listUserInRoom, level);
                }, 3000);
            }
        });
    }
}

function clientGetRecord(client) {
    conn.excuteQuery(global.query_get_record, function (data) {
        var records = {
            records : data
        }
        client.emit(global.server_send_record, records);
    });
}

function clientSaveRecord(name, money, client) {
    var query = 'select * from nine_record where username = ?';
    conn.excuteUpdate(query, [name], function (user) {
        if (!underscore.isEmpty(user)) {
            console.log(user[0]);
            var moneyCurrent = user[0]['money'];
            if (moneyCurrent < parseInt(money)) {
                var query = 'update nine_record set money = ? where username = ?';
                conn.excuteUpdate(query, [money, name], function (row) {
                    console.log('update record ok');
                });
            }
        }
        else {
            //user not exist
            var query = 'insert into nine_record (username, money) values (?,?)';
            conn.excuteUpdate(query, [name, money], function (row) {
                console.log('insert record ok');
            });
        }
    });
}

function clientReconnect(idQuestion, level, username, roomId, client) {
    var user = userMng.getUserByName(username);
    if (user != undefined) {
        if (roomId == '0')//trainng
        {
            appultis.getQuestioById(idQuestion, redis, function (question) {
                var dataReconnect = {
                    status: true,
                    level: level,
                    username: username,
                    roomId: roomId,
                    question: question
                };
                client.emit(global.server_send_reconnect, dataReconnect);
            });
        }
    }
    else {
        var dataReconnect = {
            status: false,
            message: 'Cannot reconnect, your connection is timeout!'
        }
        client.emit(global.server_send_reconnect, dataReconnect);
    }
}

function clientLeaveRoom(roomId, client) {
    var listUserInRoom;
    if (roomId != undefined)
        listUserInRoom = userMng.getListUserByRoomId(roomId);
    else
        listUserInRoom = userMng.getListUserByUser(client.id);
    userMng.getUserById(client.id, function (user) {
        if (user != undefined) {
            var data = {
                player_leave_name: user.getName()
            }
            
            if (user.getIsPlaying()) {
                data.status = false;
                data.message = 'Cannot leave room while playing';
            }
            else {
                data.status = true;
                user.setRoom("Loobby");
            }
            userMng.sendMessageToListUser(io, global.server_to_room_client_leave, data, listUserInRoom);
        }
        else {
            console.log('Cannot find user by id: %s', client.id);
        }
    });
};

http.listen(port, function () {
    var ip = require('ip').address();
    roomMng.createListRoom(global.room_default_quantity);
    console.log('===========================================');
    console.log('listen on %s at port %d', ip, port);
    console.log('===========================================');
    
    redis = _redis.createClient(process.env.REDIS_URL);
    
    redis.on('connect', function (redis) {
        console.log('Connected to Redis');
    });
    
    // appultis.delAllKeyRedis(redis, function () { 
    //     console.log('deleleted redis data completed.');
    // });
    
    redis.on('error', function (err) {
        console.log(err);
    });
});
