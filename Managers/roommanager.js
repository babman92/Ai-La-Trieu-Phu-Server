module.exports = RoomManager;

var fs = require('fs');
var Room = require('../Entities/room.js');

function RoomManager() {
    this.listRoom = [];
};

RoomManager.prototype.createListRoom = function (number) {
    //console.log('create list room');
    for (var i = 0; i < number; i++) {
        var room = new Room("Phong " + (i + 1), i.toString());
        room.setMaster("tuannd92");
        this.addRoom(room);
    }
}

RoomManager.prototype.addRoom = function (room) {
    if (this.listRoom != undefined) {
        this.listRoom.push(room);
    };
};

RoomManager.prototype.getListRoomJson = function () {
    var mess = {
        listroom: this.listRoom
    }
    return mess;
};

RoomManager.prototype.getListRoom = function () {
    return fs.readFileSync('./Configs/rooms.json').toString();
};


