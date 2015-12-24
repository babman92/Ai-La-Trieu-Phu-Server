module.exports = new AppUltis();
var base64 = require('base-64');
var math = require('math');
var Question = require('../Entities/question.js');
var conn = require('../Connectors/connection.js');

function AppUltis() { return this; }

AppUltis.prototype.decodeBase64Special = function (dataEncode) {
    var res = dataEncode.slice(0, 2) + dataEncode.slice(4, dataEncode.length);
    return res;
}

AppUltis.prototype.decodeBase64 = function (dataEncode) {
    var res = new Buffer(this.decodeBase64Special(dataEncode), 'base64').toString('utf-8');
    return res;
}

AppUltis.prototype.encodeBase64 = function (plainText) {
    var res = new Buffer(plainText).toString('base64');
    return res;
}

AppUltis.prototype.encodeBase64FromUtf8 = function (plainText) {
    //var bytes = utf8.encode(plainText);
    //var encoded = base64.encode(bytes);
    return plainText;
}

AppUltis.prototype.getNumberUserReady = function (listUserInRoom) {
    var number = 0;
    for (var i = 0; i < listUserInRoom.length; i++) {
        var player = listUserInRoom[i];
        if (player != undefined) {
            if (player.getReady()) { number++; }
        }
    }
    return number;
}

AppUltis.prototype.getNumberUserAnswer = function (listUserInRoom) {
    var number = 0;
    for (var i = 0; i < listUserInRoom.length; i++) {
        var player = listUserInRoom[i];
        if (player != undefined) {
            if (player.getAnswer() != undefined) { number++; }
        }
    }
    return number;
}

AppUltis.prototype.getNumberUserAnswerRight = function (listUserInRoom, rightAnswer) {
    var number = 0;
    for (var i = 0; i < listUserInRoom.length; i++) {
        var player = listUserInRoom[i];
        if (player != undefined) {
            if (player.getAnswer() == rightAnswer) { number++; }
        }
    }
    return number;
}

AppUltis.prototype.getRandomFloatNumber = function (min, max) {
    return math.random() * (max - min) + min;
}

AppUltis.prototype.getRandomIntNumber = function (min, max) {
    return math.floor(math.random() * (max - min) + min);
}

var numberQuestionLevel1 = 1917;
var numberQuestionLevel2 = 1754;
var numberQuestionLevel3 = 629;
AppUltis.prototype.getQuestion = function (level, redis, getQuestionDone) {
    level = parseInt((parseInt(level) - 1) / 5) + 1;
    var idQuestion = 0;
    var question = new Question();
    switch (level) {
        case 1:
            idQuestion = this.getRandomIntNumber(1, numberQuestionLevel1);
            break;
        case 2:
            idQuestion = this.getRandomIntNumber(numberQuestionLevel1 + 1 , numberQuestionLevel2 + numberQuestionLevel1);
            break;
        case 3:
            idQuestion = this.getRandomIntNumber(numberQuestionLevel1 + numberQuestionLevel2 + 1, numberQuestionLevel3 + numberQuestionLevel1 + numberQuestionLevel1);
            break;
        default:
            break;
    }
    
    redis.get(idQuestion, function (err, result) {
        if (!result) {
            //get from database
            var query = global.query_get_question_by_id;
            conn.excuteUpdate(query, [idQuestion], function (row) {
                question.loadQuestionNormal(row);
                redis.set(idQuestion, question, function (err, reply) {
                    if (err) {
                        console.log('Set data redis error...');
                        throw err;
                    }
                });
                console.log(question);
                console.log('return question from db');
                getQuestionDone(question);
            });
        }
        else {
            var x = JSON.parse(result);
            console.log('return question from redis');
            getQuestionDone(x);
        }
    });
}

AppUltis.prototype.getQuestioById = function (idQuestion, redis, getQuestionDone) {
    redis.get(idQuestion, function (err, result) {
        var question = new Question();
        if (!result) {
            //get from database
            var query = global.query_get_question_by_id;
            conn.excuteUpdate(query, [idQuestion], function (row) {
                question.loadQuestionNormal(row);
                redis.set(idQuestion, question, function (err, reply) {
                    if (err) {
                        console.log('Set data redis error...');
                        throw err;
                    }
                });
                console.log('return question from db');
                console.log(question);
                getQuestionDone(question);
            });
        }
        else {
            var x = JSON.parse(result);
            console.log('return question from redis');
            console.log(x);
            getQuestionDone(x);
        }
    });
}

AppUltis.prototype.delAllKeyRedis = function (redis, callback) {
    redis.multi()
    .keys('*', function (err, replies) {
        // NOTE: code in this callback is NOT atomic
        // this only happens after the the .exec call finishes.
        replies.forEach(function (reply, index) {
            //console.log("Reply " + index + ": " + reply.toString());
            redis.del(reply);
            //redis.get(reply, function (err, data) {
            //    console.log(data);
            //});
        });
        callback();
    })
    .exec(function (err, replies) { });
}
