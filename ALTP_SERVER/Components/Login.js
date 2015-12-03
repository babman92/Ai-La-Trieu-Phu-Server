module.exports = Login;

var crypto = require('crypto');
var Connection = require('../Connectors/connection.js');
var conn = new Connection();
var underscore = require('underscore');

function Login() { }

Login.prototype.excuteLogin = function (username, pass) {
    var md5sum = crypto.createHash('md5');
    var code = md5sum.update(pass).digest('hex');
    var query = 'select * from nine_users where username = ? and password = ?';
    var data = [username, code];
    conn.excuteUpdate(query, data, function (row) {
        if (underscore.isEmpty(row)) {
            console.log('Login error...');
        }
        else {
            console.log(row);           
        }
    });
}