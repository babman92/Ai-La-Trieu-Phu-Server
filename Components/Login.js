module.exports = new Login();

var crypto = require('crypto');
var underscore = require('underscore');

function Login() { return this; }

Login.prototype.login = function (conn, username, pass, excuteLoginDone) {
    var code = '';
    if (pass.length != 0) {
        var md5sum = crypto.createHash('md5');
        code = md5sum.update(pass).digest('hex');
    }
    var query = global.query_loginby_username_password;
    var data = [username, code];
    conn.excuteUpdate(query, data, function (row) {
        console.log(row);
        if (underscore.isEmpty(row)) {
            excuteLoginDone(false);
        }
        else {
            excuteLoginDone(true);
        }
    });
}

Login.prototype.excuteLogin = function (userManager, conn, username, pass, client) {
    this.login(conn, username, pass, function (status) {
        var message = { status: status };
        if (status) {
            userManager.setUserName(client.id, username);
            message.message = 'Login success...';
        }
        else {
            message.message = 'Login fail...';
        }
        client.emit(global.server_confirm_login, message);
    });
}