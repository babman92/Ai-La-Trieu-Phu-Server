module.exports = new UserReconnectController();

var logUtil = require('../../Ultis/LogUltis.js');

function UserReconnectController() {
    return this;
}

UserReconnectController.prototype.clientReconnect = function (redis, appultis, userManager, idQuestion, level, 
    username, roomId, client) {
    try {
        var user = userManager.getUserByName(username);
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
    } catch (ex) { 
        logUtil.log(ex);
    }
}