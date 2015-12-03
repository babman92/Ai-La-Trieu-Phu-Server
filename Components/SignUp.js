module.exports = SignUp;

var crypto = require('crypto');
var Connection = require('../Connectors/connection.js');
var conn = new Connection();

function SignUp() { }

SignUp.prototype.excuteSignup = function (username, pass) {
    var md5sum = crypto.createHash('md5');
    var code = md5sum.update(pass).digest('hex');
    console.log('pass md5: ' + code);
    var user = {
        username: username,
        password: code
    }
    var query = 'insert into nine_users set ?';
    conn.excuteUpdate(query, user, function (row) {
        if (row != undefined) {
            console.log('new user sign up.' + user);
        }
    });
}