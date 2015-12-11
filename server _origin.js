var app = require('express')();
var http = require('http').Server(app);
var port = process.env.PORT || 5000;
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
//var utf8 = require('utf8');
var arrMoney = [
    "200.000", "400.000", "600.000", "1.000.000", "2.000.000",
    "3.000.000", "6.000.000", "10.000.000", "14.000.000", "22.000.000",
    "30.000.000", "40.000.000", "60.000.000", "85.000.000", "150.000.000"
];

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

require('events').EventEmitter.prototype._maxListeners = 1000;

app.use(express.static(__dirname + '/'));
var server = http.createServer(app);
server.listen(port);

io.on(global.client_connect, function (client) {
    console.log('a user connected');
    userMng.initUser(client);
    
    client.on(global.client_disconnect, function () {
        userMng.removeUserById(client.id);
        console.log('a user disconnected: ' + client.id);
    });
    
    client.on(global.client_message, function (msg) {
        var jsonData = (msg);
        var command = jsonData['command'];
        console.log(command);
        switch (command) {
            case global.client_signup:
                var username = jsonData['username'];
                var password = jsonData['password'];
                clientSignup(username, password);
                break;
            case global.client_login:
                var username = jsonData['username'];
                var password = jsonData['password'];
                clientLogin(username, password);
                //---
                userMng.setUserName(client.id, msg);
                client.emit('server.list.room', roomMng.getListRoomJson());
                break;
            case global.client_choose_game:
                break;
            case global.client_choose_room:
                clientChooseRoom(client, msg);
                break;
            case global.client_chat:
                clientChat(client);
                break;
            case global.client_get_question:
                var level = jsonData['level'];
                clientGetQuestion(client, level);
                break;
            case global.client_answer:
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
                var duration = jsonData['duration'];
                var answerCase = jsonData['answer_case'];
                console.log(jsonData);
                clientAnswerToRoom(client, questionId, answer, duration, msg, answerCase);
                break;
            case global.client_time_out_to_room:
                
                break;
            default:
                break;
        }
    });
});

function clientSignup(username, password) {
    signup.excuteSignup(username, password);
}

function clientLogin(username, password) {
    login.excuteLogin(username, password);
}

function clientChat(client) {
    var user = userMng.getUserById(client.id);
    if (user != undefined) {
        console.log(user.toString());
    };
    var jsonData = JSON.parse(data);
    var data = '{"Sender":"Anonymous", "Content":"' + jsonData['message'] + '"}';
    var listUserInRoom = userMng.getListUserByRoomId(user.getRoomId());
    userMng.sendMessageToListUser(io, global.client_chat, data, listUserInRoom);
}

function clientChooseRoom(client, data) {
    var roomId = data['roomId'];
    var user = userMng.getUserById(client.id);
    user.setRoom(roomId);
    
    var messageToClient;
    var listUserInRoom = userMng.getListUserByRoomId(roomId);
    if (listUserInRoom.length == 1)
        messageToClient = 'Welcome to ALTP';
    else
        messageToClient = user.getName() + ' has joined room, let start';
    
    var mess = {
        message: messageToClient,
        number_player: listUserInRoom.length,
        room_id: roomId
    }
    userMng.sendMessageToListUser(io, global.server_send_client_join_room, mess, listUserInRoom);
}

function clientReady(client, data) {
    var roomId = data['roomId'];
    var user = userMng.getUserById(client.id);
    user.setReady(true);
    var listUserInRoom = userMng.getListUserByRoomId(roomId);
    var numberPlayerInRoom = appultis.getNumberUserReady(listUserInRoom);
    if (numberPlayerInRoom == (global.max_player_in_room)) {
        startGame(listUserInRoom, io);
    }
    else {
        var data = {
            status: true,
            message: 'You are ready! waiting for new player'
        }
        client.emit(global.server_to_room_confirm_ready, data);
    }
}

function clientGetQuestion(client, level) {
    level = parseInt((level - 1) / 5) + 1;
    var query = 'SELECT * FROM ninequestions where level = ? ORDER BY rand() LIMIT 1';
    conn.excuteUpdate(query, [level], function (row) {
        var question = new Question();
        question.loadQuestionNormal(row);
        console.log(question);
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

function startGame(listUser, io) {
    console.log('start game');
    var dataStart = {
        status: true,
        message: 'All player are ready, let\'s play game'
    }
    userMng.sendMessageToListUser(io, global.server_to_room_start_game, dataStart, listUser);
    
    setTimeout(function () {
        sendQuestionToRoom(1, listUser, io)
    }, 3000);
}

function sendQuestionToRoom(level, listUser, io) {
    level = parseInt((level - 1) / 5) + 1;
    var query = 'SELECT * FROM ninequestions where level = ? ORDER BY rand() LIMIT 1';
    conn.excuteUpdate(query, [level], function (row) {
        var question = new Question();
        question.loadQuestionNormal(row);
        console.log(question);
        userMng.sendMessageToListUser(io, global.server_to_room_send_question, question, listUser);
    });
}

function clientAnswerToRoom(client, questionId, answer, duration, data, answerCase) {
    var user = userMng.getUserById(client.id);
    user.setDuration(duration);
    user.setAnswer(answer);
    user.setAnswerCase(answerCase);
    user.setQuestionId(questionId);
    
    var roomId = data['roomId'];
    var listUserInRoom = userMng.getListUserByRoomId(roomId);
    
    var numberPlayerAnswer = appultis.getNumberUserAnswer(listUserInRoom);
    
    if (numberPlayerAnswer == global.max_player_in_room) {
        setTimeout(function () {
            finishGame(listUserInRoom, 4)
        }, 8000);
    }
}

function finishGame(listUserInRoom, level) {
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
                    duration: user.getDuration(),
                    money: 0
                }
                if (user.getAnswer() == rightAnswer) {
                    if (user.getDuration() == userFirst.getDuration()) {
                        u.money = arrMoney[level] / numberUserAnswerRight;
                    }
                    else
                        u.money = 0;
                }
                else
                    u.money = 0;
                data[i] = u;
            }
            
            var dataFinish = {
                data_finish: data
            }
            console.log(dataFinish);
            userMng.sendMessageToListUser(io, global.server_to_room_send_finish_match, dataFinish, listUserInRoom);
            userMng.resetUserInRoom(listUserInRoom);
        });
    }
}

http.listen(process.env.PORT || 2015, function () {
    roomMng.createListRoom(15);
    console.log('===========================================');
    console.log('IP:  '+require('ip').address());
    console.log('===========================================');
    console.log('listen on ' + process.env.IP +' at port ' + process.env.PORT);
    console.log('===========================================');
});

