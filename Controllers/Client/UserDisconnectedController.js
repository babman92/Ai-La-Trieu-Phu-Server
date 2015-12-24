module.exports = new UserDisconnectController();

var logUtil = require('../../Ultis/LogUltis.js');

function UserDisconnectController() {
    return this;
}

UserDisconnectController.prototype.disconnect = function (userManager, client) {
    try {
        console.log('a user disconnected: ' + client.id);
        setTimeout(function () {
            userManager.removeUserById(client.id, function (user) {
                console.log('delete user: ' + user);
            });
            console.log('Concurrecy number: %s', userManager.getConcurency());
        }, global.timeout);
    } catch (ex) {
        logUtil.log(ex);
    }
}