module.exports = new SignUp();

var crypto = require('crypto');

function SignUp() {
    return this;
}

SignUp.prototype.signUp = function (conn, username, pass, callback) {
    var code = '';
    if (pass) {
        var md5sum = crypto.createHash('md5');
        code = md5sum.update(pass).digest('hex');
    }
    var user = {
        username: username,
        password: code
    }
    var query = global.query_set_user;
    console.log(user);
    console.log(query);
    conn.excuteUpdate(query, user, function (row) {
        if (callback != undefined)
            callback(row);
    });
}

SignUp.prototype.excuteSignup = function (conn, username, password, client, underscore) {
    this.checkUserExist(conn, username, function (row) {
        var data = {};
        data.username = username;
        if (underscore.isEmpty(row)) {
            //new user
            this.signUp(conn, username, password, function (row) {
                if (row != undefined) {
                    data.status = true;
                    data.message = 'Signup success.';
                    client.emit(global.server_send_confirm_signup, data)
                }
                else {
                    data.status = false;
                    data.message = 'Error while sungup, please try again.';
                    client.emit(global.server_send_confirm_signup, data)
                }
            });
        }
        else {
            //user exist
            data.status = false;
            data.message = 'Username has exist, please choose other.';
            client.emit(global.server_send_confirm_signup, data)
        }
    });
}

SignUp.prototype.checkUserExist = function (conn, username, callback) {
    var query = global.query_get_user_by_username;
    conn.excuteUpdate(query, username, function (data) {
        if (callback != undefined)
            callback(data);
    });
}

SignUp.prototype.excuteSignupHttp = function (conn, username, password, res, underscore) {
    this.checkUserExist(conn, username, function (row) {
        var data = {};
        data.username = username;
        if (underscore.isEmpty(row)) {
            //new user
            var query = global.query_set_user;
                var user = {
                    username: username,
                    password: password
                }
            conn.excuteUpdate(query, user, function (row) {
                if (row != undefined) {
                    data.status = true;
                    data.message = 'Đăng kí thành công. ';
                    res.end(JSON.stringify(data));
                }
                else {
                    data.status = false;
                    data.message = 'Có lỗi xảy ra, vui lòng thử lại sau.';
                    res.end(JSON.stringify(data));
                }
            });
        }
        else {
            //user exist
            data.status = false;
            data.message = 'Tên đã được sử dụng.';
            res.end(JSON.stringify(data));
        }
    });
}