module.exports = new ServerFinishQuestion();

var logUtil = require('../../Ultis/LogUltis.js');
var serverFinishMatchCtrl = require('../Server/ServerFinishMatchController.js');


function ServerFinishQuestion() {
    return this;
}

ServerFinishQuestion.prototype.finishQuestion = function (appultis, conn, userManager, io, listUserInRoom, level) {
    try {
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
            var query = global.query_get_right_answer;
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
                            u.money = global.MoneyMoldys[level] / numberUserAnswerRight;
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
                    //bo san sang
                    user.setReady(false);
                    user.setIsPlaying(false);
                    user.setAnswer(undefined);
                }
                
                var dataFinish = {
                    data_finish: data
                }
                
                console.log(dataFinish);
                userManager.sendMessageToListUser(io, global.server_to_room_send_finish_question, dataFinish, listUserInRoom);
                
                //finish match
                console.log(userFirst.getNumberAnswed() + '>-------fisnish question check finish match-------<' + global.max_number_question_in_room);
                if (userFirst.getNumberAnswed() == global.max_number_question_in_room) {
                    setTimeout(function () {
                        serverFinishMatchCtrl.finishMatch(userManager, io, listUserInRoom);
                    }, global.time_wait_to_finish_match);
                }
            });
        }
    } catch (ex) {
        logUtil.log(ex);
    }
}