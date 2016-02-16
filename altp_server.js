//create by ninesoft.com.vn
//==============external=============================================
var app = require('express')();
var http = require('http').Server(app);
var port = process.env.PORT || 2015;
//var port = global.port;
require('events').EventEmitter.prototype._maxListeners = 0;
var io = require('socket.io')(http);
var fs = require('fs');
var base64 = require('base-64');
var _redis = require('redis');
var redis = undefined;
var math = require('math');
var underscore = require('underscore');
//=============end external==========================================
//=============internal==============================================
var constant = require('./Configs/Constant.js');
var roomManager = require('./Managers/roommanager.js');
var userManager = require('./Managers/usermanager.js');
var conn = require('./Connectors/connection.js');
var signup = require('./Components/SignUp.js');
var login = require('./Components/Login.js');
var appultis = require('./Ultis/appultis.js');
var logUtil = require('./Ultis/LogUltis.js');
//-------------controller--------------------------
var userAnserQuestionCtl = require('./Controllers/Client/UserAnswerQuestionController.js');
var userChooseRoomCtl = require('./Controllers/Client/UserChooseRoomController.js');
var userConnectedController = require('./Controllers/Client/UserConnectedController.js');
var userDisconnectedController = require('./Controllers/Client/UserDisconnectedController.js');
var userGetQuestionController = require('./Controllers/Client/UserGetQuestionController.js');
var userGetRecordManager = require('./Controllers/Client/UserGetRecordManager.js');
var userLeaveRoomController = require('./Controllers/Client/UserLeaveRoomController.js');
var userReadyToPlayController = require('./Controllers/Client/UserReadyToPlayController.js');
var userReconnectController = require('./Controllers/Client/UserReconnectController.js');
var userSaveRecordController = require('./Controllers/Client/UserSaveRecordController.js');
var userStartMatchController = require('./Controllers/Client/UserStartMatchController.js');
var userGetListRoomController = require('./Controllers/Client/UserGetListRoomController.js');

var serverFinishMatchController = require('./Controllers/Server/ServerFinishMatchController.js');
var serverFinishQuestionController = require('./Controllers/Server/ServerFinishQuestionController.js');
var serverSendQuestionController = require('./Controllers/Server/ServerSendQuestionController.js');
var serverStartMatchController = require('./Controllers/Server/ServerStartMatchController.js');
//-------------end controller----------------------
//-------------object------------------------------
var Question = require('./Entities/question.js');
var Message = require('./Entities/message.js');
var Room = require('./Entities/room.js');
//-------------end object--------------------------
//=============end intenal===========================================

app.get("/altp/record/list", function(req, res){
	userGetRecordManager.clientGetRecordHttp(conn, res);
	//res.end("Hello World");
});

app.get("/altp/record/save", function(req, res){
    console.log('user save record');
    var username = req.param('user');
    var money = req.param('money');
    userSaveRecordController.clientSaveRecordHttp(conn, username, money, underscore, res);
});

app.get("/altp/user/register", function(req, res){
    var username = req.param('user');
    signup.excuteSignupHttp(conn, username, '', res, underscore);
});

io.on(global.client_connect, function (client) {
    
    userConnectedController.initUser(userManager, client);
    
    client.on(global.client_disconnect, function () {
        userDisconnectedController.disconnect(userManager, client);
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
                userGetListRoomController.getListRoom(roomManager, client);
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
        console.log('Concurrecy number: %s', userManager.getConcurency());
    });
});

function clientSignup(username, password, client) {
    signup.excuteSignup(conn, username, password, client, underscore);
}

function clientLogin(username, password, client) {
    login.excuteLogin(userManager, conn, username, password, client)
}

function clientChooseRoom(client, data) {
    var roomId = data['roomId'];
    userChooseRoomCtl.chooseRoom(io, userManager, roomId, client);
}

function clientReady(client, data) {
    try {
        var roomId = data['roomId'];
        var level = data['level'];
        userReadyToPlayController.userReady(io, appultis, userManager, client, roomId, level, 
            function (listUserInRoom, io, level) {
            serverStartMatchController.statMatch(conn, userManager, listUserInRoom, io, level);
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
    userAnserQuestionCtl.clientAnswer(conn, client, questionId, answer);
}

function clientAnswerToRoom(client, questionId, answerContent, level, answer, 
    duration, data, answerCase) {
    var roomId = data['roomId'];
    userAnserQuestionCtl.clientAnswerToRoom(conn, io, appultis, userManager, client,
         questionId, answerContent, level,
         answer, duration, roomId, answerCase);
}

function clientGetRecord(client) {
    userGetRecordManager.clientGetRecord(conn, client);
}

function clientSaveRecord(name, money, client) {
    userSaveRecordController.clientSaveRecord(conn, name, money, client, underscore);
}

function clientReconnect(idQuestion, level, username, roomId, client) {
    userReconnectController.clientReconnect(redis, appultis, userManager, idQuestion, level, username, roomId, client);
}

function clientLeaveRoom(roomId, client) {
    userLeaveRoomController.clientLeaveRoom(io, userManager, roomId, client);
};

http.listen(port, function () {
    conn.initConnectionToDB();

   	var welcome = fs.readFileSync('./welcome.txt').toString();
   	console.log(welcome);

    var ip = require('ip').address();
    roomManager.createListRoom(global.room_default_quantity);
    console.log('===========================================');
    console.log('listen on %s at port %d', ip, port);
    console.log('===========================================');
    
    redis = _redis.createClient(process.env.REDIS_URL);
    
    redis.on('connect', function (redis) {
        console.log('Connected to Redis');
    });
    
    redis.on('error', function (err) {
        console.log(err);
    });
});