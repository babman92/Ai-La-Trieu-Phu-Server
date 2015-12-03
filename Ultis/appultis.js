module.exports = AppUltis;
var base64 = require('base-64');
//var utf8 = require('utf8');

function AppUltis() { }

AppUltis.prototype.decodeBase64Special = function (dataEncode) {
    var res = dataEncode.slice(0, 2) + dataEncode.slice(4, dataEncode.length);
    return res;
}

AppUltis.prototype.decodeBase64 = function (dataEncode) {
    var res = new Buffer(this.decodeBase64Special(dataEncode), 'base64').toString('utf-8');
    return res;
}

AppUltis.prototype.encodeBase64 = function (plainText) {
    var res = new Buffer(plainText).toString('base64');
    return res;
}

AppUltis.prototype.encodeBase64FromUtf8 = function (plainText) {
    //var bytes = utf8.encode(plainText);
    //var encoded = base64.encode(bytes);
    return plainText;
}

AppUltis.prototype.getNumberUserReady = function (listUserInRoom) {
    var number = 0;
    for (var i = 0; i < listUserInRoom.length; i++) {
        var player = listUserInRoom[i];
        if (player != undefined) {
            if (player.getReady()) { number++; }
        }
    }
    return number;
}

AppUltis.prototype.getNumberUserAnswer = function (listUserInRoom) {
    var number = 0;
    for (var i = 0; i < listUserInRoom.length; i++) {
        var player = listUserInRoom[i];
        if (player != undefined) {
            if (player.getAnswer() != undefined) { number++; }
        }
    }
    return number;
}

AppUltis.prototype.getNumberUserAnswerRight = function (listUserInRoom, rightAnswer) {
    var number = 0;
    for (var i = 0; i < listUserInRoom.length; i++) {
        var player = listUserInRoom[i];
        if (player != undefined) {
            if (player.getAnswer() == rightAnswer) { number++; }
        }
    }
    return number;
}

