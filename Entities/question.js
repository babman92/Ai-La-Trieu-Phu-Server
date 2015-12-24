module.exports = Question;

var appultis = require('../Ultis/appultis.js');

function Question() { }

Question.prototype.loadQuestionBase64String = function (dataEncode) {
    var origin = dataEncode[0]['question'];
    var decode = appultis.decodeBase64Special(origin);
    this.question = appultis.decodeBase64(decode);
    this.level = dataEncode[0]['level'];
    this.id = dataEncode[0]['id'];
    this.casea = appultis.decodeBase64(dataEncode[0]['casea']);
    this.caseb = appultis.decodeBase64(dataEncode[0]['caseb']);
    this.casec = appultis.decodeBase64(dataEncode[0]['casec']);
    this.cased = appultis.decodeBase64(dataEncode[0]['cased']);
}

Question.prototype.loadQuestionNormal = function (dataEncode) {
    if (dataEncode.length != 0) {
        this.status = true;
        this.question = dataEncode[0]['question'];
        this.level = dataEncode[0]['level'];
        this.id = dataEncode[0]['id'];
        this.casea = dataEncode[0]['casea'];
        this.caseb = dataEncode[0]['caseb'];
        this.casec = dataEncode[0]['casec'];
        this.cased = dataEncode[0]['cased'];
    }
    else {
        this.status = false;
        this.error = "No question.";
    }
}

Question.prototype.toString = function () {
    return JSON.stringify(this);
}