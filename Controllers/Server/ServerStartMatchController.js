module.exports = new ServerStartMatchController();

var logUtil = require('../../Ultis/LogUltis.js');
var serverSendQuestionController = require('./ServerSendQuestionController.js');

function ServerStartMatchController() {
    return this;
}

ServerStartMatchController.prototype.statMatch = function (conn, userManager, listUser, io, level) {
    try {
        console.log('start game');
        var dataStart = {
            status: true,
            message: 'All player are ready, let\'s play game'
        }
        userManager.sendMessageToListUser(io, global.server_to_room_start_game, dataStart, listUser);
        
        setTimeout(function () {
            serverSendQuestionController.sendQuestionToRoom(conn, userManager, level, listUser, io);
        }, 500);
    } catch (ex) {
        logUtil.log(ex);
    }
}
