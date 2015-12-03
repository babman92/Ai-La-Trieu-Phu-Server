module.exports = UserManager

var User = require('../Entities/user.js');

function UserManager() {
    this.listUser = [];
}

UserManager.prototype.initUser = function (socket) {
    var user = new User(socket, 'anonymous');
    this.addUser(user, 'Lobby');
};

UserManager.prototype.addUser = function (user, room) {
    user.setRoom(room);
    this.listUser.push(user);
};

UserManager.prototype.removeUser = function (user) {
    this.listUser.pop(user);
};

UserManager.prototype.removeUserById = function (userId) {
    var user = this.getUserById(userId);
    if (user != undefined) {
        this.removeUser(user);
        console.log('remove user');
    };
};

UserManager.prototype.getUserById = function (userId) {
    for (var i = 0; i < this.listUser.length; i++) {
        var user = this.listUser[i]
        if (user != undefined) {
            if (user.getSessionId() == userId) {
                return user;
            };
        };
    };
};

UserManager.prototype.setUserName = function (userId, name) {
    var user = this.getUserById(userId);
    if (user != undefined) {
        user.setName(name);
    };
};

UserManager.prototype.sendMessageToListUser = function (io, command, message, listUserSelected) {
    for (var i = 0; i < listUserSelected.length; i++) {
        var user = listUserSelected[i]
        if (user != undefined) {
            var client = io.sockets.connected[user.getSessionId()];
            if (client != undefined) {
                client.emit(command, message);
            };
            console.log('send meaagse to session: ' + user.getSessionId());
        };
    };
};

UserManager.prototype.getListUserByUser = function (userId) {
    console.log(userId);
    listUser = [];
    var userChoose = this.getUserById(userId);
    if (userChoose != undefined) {
        for (var i = 0; i < this.listUser.length; i++) {
            var user = this.listUser[i];
            if (user != undefined) {
                if (user.getRoomId() == userChoose.getRoomId()) {
                    listUser.push(user);
                };
            };
        };
    };
    return listUser;
};

UserManager.prototype.getListUserByRoomId = function (roomId) {
    listUser = [];
    for (var i = 0; i < this.listUser.length; i++) {
        var user = this.listUser[i];
        if (user != undefined) {
            if (user.getRoomId() == roomId) {
                listUser.push(user);
            };
        };
    };
    return listUser;
};

UserManager.prototype.resetUserInRoom = function (listUser) {
    for (var i = 0; i < listUser.length; i++) {
        var user = listUser[i];
        if (user != undefined) {
            user.reset();
        };
    };
}