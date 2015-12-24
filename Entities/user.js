module.exports = User;

function User(socket, name) {
    this.Name = name;
    this.SessionId = socket.id;
    //socket.upgradeReq.headers['sec-websocket-key']
    this.Connected = true;
}

User.prototype.setName = function (name) {
    this.Name = name;
};

User.prototype.getName = function () {
    return this.Name;
}

User.prototype.getSessionId = function () {
    return this.SessionId;
};

User.prototype.getRoomId = function () {
    return this.RoomId;
};

User.prototype.setRoom = function (roomId) {
    this.RoomId = roomId;
};

User.prototype.toString = function () {
    return this.Name.toString() + ' : ' + this.RoomId.toString();
};

User.prototype.isConnected = function () {
    return this.Connected;
}

User.prototype.setReady = function (isReady) {
    this.Ready = isReady;
}

User.prototype.getReady = function () {
    return this.Ready;
}

User.prototype.setIsPlaying = function (isPlaying) {
    this.IsPlaying = isPlaying;
}

User.prototype.getIsPlaying = function () {
    return this.IsPlaying;
}

User.prototype.increaseNumberAnsered = function () {
    if (!this.NumberQuestionAnswered)
        this.NumberQuestionAnswered = 0;
    this.NumberQuestionAnswered++;
    console.log('increase number answered: ' + this.NumberQuestionAnswered);
}

User.prototype.getNumberAnswed = function () {
    return this.NumberQuestionAnswered;
}

User.prototype.resetNumberAnswed = function () {
    this.NumberQuestionAnswered = 0;
}

User.prototype.setDuration = function (duration) {
    this.increaseNumberAnsered();
    this.Duration = (global.time_answer_question - parseInt(duration));
    this.setTotalDuration(this.Duration);
}

User.prototype.getDuration = function () {
    return this.Duration;
}

User.prototype.setTotalDuration = function (duration) {
    if (!this.TotalDuration)
        this.TotalDuration = 0;
    this.TotalDuration += duration;
    //console.log('total duration: %d', this.TotalDuration);
    //console.log('number question answer: %d', this.getNumberAnswed());
}

User.prototype.getTotalDuration = function () {
    return this.TotalDuration;
}

User.prototype.getAverageDuration = function () {
    return parseFloat(this.getTotalDuration()) / parseFloat(this.getNumberAnswed());
}

User.prototype.resetDuration = function () {
    this.setDuration(0);
    this.NumberQuestionAnswered = 0;
    this.setTotalDuration(0);
}

//answer text
User.prototype.setAnswer = function (answer) {
    this.Answer = answer;
}

User.prototype.getAnswer = function () {
    return this.Answer;;
}

//A,B,C,D
User.prototype.setAnswerCase = function (answerCase) {
    this.AnswerCase = answerCase;
}

User.prototype.getAnswerCase = function () {
    return this.AnswerCase;
}

User.prototype.setQuestionId = function (questionId) {
    this.QuestionId = questionId;
}

User.prototype.getQuestionId = function () {
    return this.QuestionId;
}

User.prototype.setQuestionId = function (questionId) {
    this.QuestionId = questionId;
}

User.prototype.getQuestionId = function () {
    return this.QuestionId;
}

User.prototype.setAnswerContent = function (answerContent) {
    this.AnswerContent = answerContent;
}

User.prototype.getAnswerContent = function () {
    return this.AnswerContent;
}

User.prototype.reset = function () {
    this.setAnswerCase(undefined);
    this.setAnswer(undefined);
    this.setReady(false);
    this.resetDuration();
    this.resetMoneyTotal();
    this.resetNumberAnswed();
    this.setIsPlaying(false);
}

User.prototype.initData = function () {
    this.setDuration(0);
    this.setMoneyTotalInMatch();
}

User.prototype.startTimeout = function (timeOutDone) {
    setTimeout(function () {
        if (timeOutDone != undefined)
            timeOutDone();
    } , global.timeout);
}

User.prototype.setMoneyTotalInMatch = function (money) {
    if (!this.Money)
        this.Money = 0;
    this.Money += money;
}

User.prototype.getMoneyTotalInMatch = function () {
    return this.Money;
}

User.prototype.resetMoneyTotal = function () {
    this.Money = 0;
}