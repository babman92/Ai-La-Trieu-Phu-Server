module.exports = new UserConnectedController();

var logUtil = require('../../Ultis/LogUltis.js');

function UserConnectedController() {
    return this;
}

UserConnectedController.prototype.initUser = function (userManager, client) {
    try {
        console.log('a user connected');
        userManager.initUser(client);
    } catch (ex) {
        logUtil.log(ex);
    }
}