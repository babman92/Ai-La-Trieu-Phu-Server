module.exports = User;

function User(socket, name) {
    this.Name = name;
    this.SessionId = socket.upgradeReq.headers['sec-websocket-key']// socket.id;
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

User.prototype.setDuration = function (duration) {
    this.Duration = duration;
}

User.prototype.getDuration = function () {
    return this.Duration;
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

User.prototype.reset = function () {
    this.setAnswerCase(undefined);
    this.setAnswer(undefined);
    this.setDuration(-1);
    this.setReady(false);
}

