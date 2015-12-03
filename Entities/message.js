module.exports = Message;
var method = Message.prototype;

function Message(sender, content){
	this.Sender=sender;
	this.Content = content;
}

method.toString = function(){
	return JSON.stringify(this);
}



