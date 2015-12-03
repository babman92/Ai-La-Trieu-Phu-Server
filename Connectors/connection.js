module.exports = Connection;

var mysql = require('mysql');
var fs = require('fs');

function Connection() {
    var config = this.readConfig();
    var dataJson = JSON.parse(config);
    //var dbInfo = {
    //    host : dataJson['host'],
    //    user : dataJson['user'],
    //    password : dataJson['password'],
    //    database : dataJson['database'],
    //}
    //this.connection = mysql.createConnection(dbInfo);
    
    var poolConfig = {
        connectionLimit  : dataJson['connectionLimit'],
        host : dataJson['host'],
        user : dataJson['user'],
        password : dataJson['password'],
        database : dataJson['database'],
        debug : dataJson['debug'],
    }
    this.pool = mysql.createPool(poolConfig);
}

Connection.prototype.readConfig = function () {
    var config = fs.readFileSync('./Configs/dbconfig.json').toString();
    return config;
}

Connection.prototype.connectToDb = function () {
    this.connection.connect(function (err) {
        if (!err) {
            console.log("Database is connected ... \n\n");
        }
        else {
            console.log("Connect error...\n\n");
        }
    });
}

Connection.prototype.excuteQuery = function (query, finish) {
    this.pool.getConnection(function (err, connection) {
        if (err) {
            if (connection != undefined)
                connection.release();
            return;
        }
        else {
            //console.log('Connected as id: ' + connection.threadId);
            connection.query(query, function (err, row) {
                if (!err) {
                    if (finish != undefined) {
                        finish(row);
                    }
                }
                else {
                    console.log('Error while performing query...');
                }
            });
            
            connection.on('error', function (err) {
                console.log('Error while connect to database...');
                return;
            });
            if (connection != undefined)
                connection.release();
        }
    });
}

Connection.prototype.excuteUpdate = function (query, data, finish) {
    this.pool.getConnection(function (err, connection) {
        if (err) {
            if (connection != undefined)
                connection.release();
            return;
        }
        else {
            //console.log('Connected as id: ' + connection.threadId);
            connection.query(query, data, function (err, row) {
                if (!err) {
                    if (finish != undefined) {
                        finish(row);
                    }
                }
                else {
                    console.log('Error while performing query...');
                }
            });
            
            connection.on('error', function (err) {
                console.log('Error while connect to database...');
                return;
            });
            if (connection != undefined)
                connection.release();
        }
    });
}

Connection.prototype.demo = function () {
    //conn.connectToDb();
    //conn.excuteQuery('select * from ninequestions limit 1', function (data) {
    //    console.log(data);
    //});
    
    //var user = {
    //    username: 'tuannd',
    //    password: '123',
    //    money: 1000,
    //    fullname: 'Nguyen Duy Tuan'
    //}

    //var query = 'insert into nine_users set ?';
    
    //var query = 'update nine_users set username = ? where id = ?';
    
    //var query = 'delete from nine_users where id = ?';
    //conn.excuteUpdate(query, [1], function (data) {
    //    console.log(data);
    //});
}