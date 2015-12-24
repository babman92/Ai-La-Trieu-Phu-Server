module.exports = new UserManager();

var User = require('../Entities/user.js');

function UserManager() {
    this.listUser = [];
    return this;
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
    this.removeUserById(user.getSessionId());
    console.log('remove user by object');
};

UserManager.prototype.removeUserById = function (userId, removeDone) {
    for (var i = this.listUser.length - 1; i >= 0 ; i--) {
        var user = this.listUser[i]
        if (user != undefined) {
            if (user.getSessionId() == userId) {
                var userRemoved = this.listUser.splice(i, 1)[0];
                if (removeDone != undefined)
                    removeDone(userRemoved);
                break;
            };
        };
    };
};

UserManager.prototype.getUserById = function (userId, getUserDone) {
    for (var i = 0; i < this.listUser.length; i++) {
        var user = this.listUser[i]
        if (user != undefined) {
            if (user.getSessionId() == userId) {
                if (getUserDone != undefined)
                    getUserDone(user);
            };
        };
    };
};

UserManager.prototype.getUserByName = function (username) {
    for (var i = 0; i < this.listUser.length; i++) {
        var user = this.listUser[i]
        if (user != undefined) {
            if (user.getName() == username) {
                return user;
            };
        };
    };
};

UserManager.prototype.setUserName = function (userId, name) {
    this.getUserById(userId, function (user) {
        if (user != undefined) {
            user.setName(name);
        };
    });
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
    this.getUserById(userId, function (user) {
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
    });
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

UserManager.prototype.getConcurency = function () {
    return this.listUser.length;
}