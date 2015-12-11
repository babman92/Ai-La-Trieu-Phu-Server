var express = require('express')();
var app = require('http').createServer(express);
var io = require('socket.io')(app);
var fs = require('fs');
var port = process.env.PORT || 5000;

app.listen(port, function(){
  console.log('server started at %d...', port);
});

io.on('connection', function (socket) {
  console.log('new user');
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});