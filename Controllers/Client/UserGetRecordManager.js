module.exports = new UserGetRecordController();

var logUtil = require('../../Ultis/LogUltis.js');

function UserGetRecordController() {
    return this;
}

UserGetRecordController.prototype.clientGetRecord = function (conn, client) {
    try {
        conn.excuteQuery(global.query_get_record, function (data) {
            var records = {
                records : data
            }
            client.emit(global.server_send_record, records);
        });
    } catch (ex) { 
        logUtil.log(ex);
    }
}