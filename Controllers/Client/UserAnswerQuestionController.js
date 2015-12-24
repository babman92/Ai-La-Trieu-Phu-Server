module.exports = new UserAnswerQuestionController();

var logUtil = require('../../Ultis/LogUltis.js');
var serverFinishQuestionCtrl = require('../Server/ServerFinishQuestionController.js');

function UserAnswerQuestionController() {
    return this;
}

UserAnswerQuestionController.prototype.clientAnswer = function (conn, client, questionId, answer) {
    try {
        var query = global.query_get_right_answer;
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
    catch (ex) {
        console.log();
    }
}

UserAnswerQuestionController.prototype.clientAnswerToRoom = function (conn, io, appultis, userManager,
     client, questionId, answerContent,
     level, answer, duration, roomId, answerCase) {
    try {
        userManager.getUserById(client.id, function (user) {
            user.setDuration(duration);
            user.setAnswer(answer);
            user.setAnswerCase(answerCase);
            user.setQuestionId(questionId);
            user.setAnswerContent(answerContent);
            
            var listUserInRoom = userManager.getListUserByRoomId(roomId);
            
            var numberPlayerAnswer = appultis.getNumberUserAnswer(listUserInRoom);
            
            //console.log(numberPlayerAnswer + '>--------------<' + global.max_player_in_room);
            if (numberPlayerAnswer == global.max_player_in_room) {
                setTimeout(function () {
                    serverFinishQuestionCtrl.finishQuestion(appultis, conn, userManager, io, listUserInRoom, level);
                }, global.time_wait_to_finish_question);
            }
        });
    } catch (ex) {
        logUtil.log(ex);
    }
}