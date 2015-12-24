module.exports = new UserGetQuestionController();

var logUtil = require('../../Ultis/LogUltis.js');

function UserGetQuestionController() {
    return this;
}

UserGetQuestionController.prototype.getQuestion = function (redis, appultis, client, level) {
    try {
        appultis.getQuestion(level, redis, function (question) {
            client.emit(global.server_send_question, question);
        });
    } catch (ex) { 
        logUtil.log(ex);
    }
}