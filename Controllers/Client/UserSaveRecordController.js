module.exports = new UserSaveRecordController();

var logUtil = require('../../Ultis/LogUltis.js');

function UserSaveRecordController() {
    return this;
}

UserSaveRecordController.prototype.clientSaveRecord = function (conn, name, money, client, underscore) {
    try {
        var query = global.query_get_record_user;
        conn.excuteUpdate(query, [name], function (user) {
            if (!underscore.isEmpty(user)) {
                console.log(user[0]);
                var moneyCurrent = user[0]['money'];
                if (moneyCurrent < parseInt(money)) {
                    var query = global.query_update_record_user;
                    conn.excuteUpdate(query, [money, name], function (row) {
                        console.log('update record ok');
                    });
                }
            }
            else {
                //user not exist
                var query = global.query_set_record_user;
                conn.excuteUpdate(query, [name, money], function (row) {
                    console.log('insert record ok');
                });
            }
        });
    } catch (ex) {
        logUtil.log(ex);
    }
}

UserSaveRecordController.prototype.clientSaveRecordHttp = function (conn, name, money, underscore, res) {
    try {
        var query = global.query_get_record_user;
        conn.excuteUpdate(query, [name], function (user) {
            if (!underscore.isEmpty(user)) {
                console.log(user[0]);
                var moneyCurrent = user[0]['money'];
                if (moneyCurrent < parseInt(money)) {
                    var query = global.query_update_record_user;
                    conn.excuteUpdate(query, [money, name], function (row) {
                        var result ={
                            status: true,
                            money: money,
                            message: 'Cập nhật kỷ lục thành công.'
                        }
                        res.end(JSON.stringify(result));
                        console.log('update record ok');
                    });
                }
                else
                {
                    var result ={
                            status: false,
                            money: moneyCurrent,
                            message: 'Số tiền hiện tại thấp hơn hoặc bằng kỷ lục.' 
                        }
                        res.end(JSON.stringify(result));
                }
            }
            else {
                //user not exist
                var query = global.query_set_record_user;
                conn.excuteUpdate(query, [name, money], function (row) {
                    var result ={
                        status: true,
                        money: money,
                        message: 'Ghi nhận kỷ lục mới thành công.'
                    }
                    res.end(JSON.stringify(result));
                });
            }
        });
    } catch (ex) {
        logUtil.log(ex);
    }
}