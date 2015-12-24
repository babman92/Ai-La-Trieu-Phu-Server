module.exports = new ServerSendQuestionController();

var Question = require('../../Entities/question.js');
var logUtil = require('../../Ultis/LogUltis.js');

function ServerSendQuestionController() {
    return this;
}

ServerSendQuestionController.prototype.sendQuestion = function (userManager, conn, level, listUser, io) {
    try {
        level = parseInt((level - 1) / 5) + 1;
        var query = global.query_get_question_random;
        conn.excuteUpdate(query, [level], function (row) {
            var question = new Question();
            question.loadQuestionNormal(row);
            console.log(question);
            userManager.sendMessageToListUser(io, global.server_to_room_send_question, question, listUser);
            for (var i = 0; i < listUser.length; i++) {
                var user = listUser[i];
                if (user != undefined) {
                    user.setIsPlaying(true);
                }
            }
            console.log('send question to room');
        });
    } catch (ex) {
        logUtil.log(ex);
    }
}

ServerSendQuestionController.prototype.sendQuestionToRoom = function (conn, userManager, level, listUser, io) {
    level = parseInt((level - 1) / 5) + 1;
    var query = 'SELECT * FROM ninequestions where level = ? ORDER BY rand() LIMIT 1';
    conn.excuteUpdate(query, [level], function (row) {
        var question = new Question();
        question.loadQuestionNormal(row);
        console.log(question);
        userManager.sendMessageToListUser(io, global.server_to_room_send_question, question, listUser);
        for (var i = 0; i < listUser.length; i++) {
            var user = listUser[i];
            if (user != undefined) {
                user.setIsPlaying(true);
            }
        }
        console.log('send question to room');
    });
}