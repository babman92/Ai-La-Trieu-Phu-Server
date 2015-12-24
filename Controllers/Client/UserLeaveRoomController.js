module.exports = new UserLeaveRoomController();

var logUtil = require('../../Ultis/LogUltis.js');
var serverFinishMatchController = require('../Server/ServerFinishMatchController.js');

function UserLeaveRoomController() {
    return this;
}

UserLeaveRoomController.prototype.clientLeaveRoom = function (io, userManager, roomId, client) {
    try {
        var listUserInRoom;
        if (roomId != undefined)
            listUserInRoom = userManager.getListUserByRoomId(roomId);
        else
            listUserInRoom = userManager.getListUserByUser(client.id);
        userManager.getUserById(client.id, function (user) {
            if (user != undefined) {
                var data = {
                    player_leave_name: user.getName()
                }
                
                if (user.getIsPlaying()) { // khong cho roi phong
                    data.status = false;
                    data.message = 'Cannot leave room while playing';
                    client.emit(global.server_to_room_client_leave, data);
                }
                else { // duoc phep roi phong
                    data.status = true;
                    user.reset();
                    user.setRoom("Lobby");
                    //finish match
                    userManager.sendMessageToListUser(io, global.server_to_room_client_leave, data, listUserInRoom);
                    
                    setTimeout(function () {
                        serverFinishMatchController.finishMatch(userManager, io, listUserInRoom);
                    }, 2000);
                }
            }
            else {
                console.log('Cannot find user by id: %s', client.id);
            }
        });
    } catch (ex) {
        logUtil.log(ex);
    }
};