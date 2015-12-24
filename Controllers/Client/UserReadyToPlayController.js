module.exports = new UserReadyToPlayController();

var logUtil = require('../../Ultis/LogUltis.js');

function UserReadyToPlayController() {
    return this;
}

UserReadyToPlayController.prototype.userReady = function (io, appultis, userManager, 
    client, roomId, level, startGame) {
    try {
        userManager.getUserById(client.id, function (user) {
            if (user.getReady())
                return;
            user.setReady(true);
            var listUserInRoom = userManager.getListUserByRoomId(roomId);
            var numberPlayerInRoom = appultis.getNumberUserReady(listUserInRoom);
            
            console.log('====================number player ready in room : ' + numberPlayerInRoom + '==========================');
            
            if (numberPlayerInRoom == (global.max_player_in_room)) {
                startGame(listUserInRoom, io, level);
            }
            else {
                var data = {
                    status: true,
                    message: 'You are ready! waiting for new player'
                }
                client.emit(global.server_to_room_confirm_ready, data);
            }
        });
    }
    catch (ex) {
        logUtil.log(ex);
    }
}