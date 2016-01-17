/**
 * Created by yimeng on 17/01/16.
 */
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.on('chat message', function(msg){
        console.log('send a message with the message ID ' + msg );

        //processing the message and get the message value in the database

        io.emit('chat message', "the asked message (" + msg  + ") is blablabla.");
    });
});


http.listen(3000, function(){
    console.log('listening on *:3000');
});