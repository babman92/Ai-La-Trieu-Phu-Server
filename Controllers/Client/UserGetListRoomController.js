module.exports = new UserGetListRoomController();

function UserGetListRoomController() {
    return this;
}

UserGetListRoomController.prototype.getListRoom = function (roomManager, client) {
    var listRoom = roomManager.getListRoomJson();
    console.log(listRoom);
    client.emit(global.server_send_listroom, listRoom);
}