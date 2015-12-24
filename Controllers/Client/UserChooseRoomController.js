module.exports = new UserChooseRoomController();

var logUtil = require('../../Ultis/LogUltis.js');

function UserChooseRoomController() {
    return this;
}

UserChooseRoomController.prototype.chooseRoom = function (io, userManager, roomId, client) {
    try {
        userManager.getUserById(client.id, function (user) {
            if (user != undefined) {
                var messageToClient;
                var listUserInRoom = userManager.getListUserByRoomId(roomId);
                
                var mess = {};
                
                if (listUserInRoom.length == global.max_player_in_room) {
                    mess.status = false;
                    mess.message = 'Room is full!';
                    client.emit(global.server_send_client_join_room, mess);
                }
                else {
                    mess.status = true;
                    mess.username_new_client = user.getName(),
                    mess.number_player = listUserInRoom.length,
                    mess.room_id = roomId
                    
                    user.setRoom(roomId);
                    if (listUserInRoom.length == 1)
                        messageToClient = 'Welcome to ALTP';
                    else
                        messageToClient = user.getName() + ' has joined room, let start';
                    mess.message = messageToClient;
                    listUserInRoom = userManager.getListUserByRoomId(roomId);
                    userManager.sendMessageToListUser(io, global.server_send_client_join_room, mess, listUserInRoom);
                }
            };
        });
    } catch (ex) {
        logUtil.log(ex);
    }
}