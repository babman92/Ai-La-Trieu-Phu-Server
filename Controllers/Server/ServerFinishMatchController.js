module.exports = new ServerFinishMatchController();

var logUtil = require('../../Ultis/LogUltis.js');

function ServerFinishMatchController() {
    return this;
}

ServerFinishMatchController.prototype.finishMatch = function (userManager, io,listUserInRoom) {
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
            data_finish : dataFinishMatch
        }
        console.log(data);
        userManager.sendMessageToListUser(io, global.server_to_room_send_finish_match, data, listUserInRoom);
        
        for (var i = 0; i < listUserInRoom.length; i++) {
            var user = listUserInRoom[i];
            if (user != undefined) {
                user.reset();
            }
        }
    }
    catch (ex) {
        logUtil.log(ex);
    }
}