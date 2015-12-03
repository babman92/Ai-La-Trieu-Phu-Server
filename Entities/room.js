module.exports = Room;

var User = require('./user.js');

function Room(name, roomId) {
    this.Name = name;
    this.RoomId = roomId;
    this.listUser = [];
};

Room.prototype.setMaster = function (master) {
    this.Master = master;
}

Room.prototype.getRoomId = function () {
    return this.RoomId;
};

Room.prototype.toString = function () {
    return this.Name.toString() + ' : ' + this.RoomId.toString();
};

Room.prototype.getUser = function (sessionId) {
    var userFound = undefined;
    for (var i = 0; i < this.listUser.length; i++) {
        var user = this.listUser[i];
        if (user != undefined) {
            
            if (user.getSessionId() == sessionId) {
                userFound = user;
                break;
            }
        }
    }
    var x = 'Number user in ' + this.Name + ' : ' + this.listUser.length;
    console.log(x);
    return userFound;
};

Room.prototype.removeUser = function (user) {
    this.listUser.pop(user);
    var x = 'Number user in ' + this.Name + ' : ' + this.listUser.length;
    console.log(x);
};

Room.prototype.setUserName = function (sessionId, name) {
    for (var i = 0; i < this.listUser.length; i++) {
        var user = this.listUser[i];
        if (user != undefined) {
            if (user.getSessionId() == sessionId) {
                user.setName(name);
                break;
            }
        }
    }
};

Room.prototype.getListUser = function () {
    return this.listUser;
};