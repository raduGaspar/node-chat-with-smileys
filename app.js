var express = require("express"),
    app = express(),
    port = 3000,
    io = require('socket.io').listen(app.listen(port));

app.set('views', __dirname + '/tmp');
app.set('view engine', "jade");
app.use(express.static(__dirname + '/public'));
app.engine('jade', require('jade').__express);

// render index.jade as the homepage
app.get("/", function(req, res) {
    res.render("index");
});

// listen for socket connetion
io.sockets.on('connection', function (socket) {
	// show welcome message
    socket.emit('message', { message: 'welcome to the chat' });

    // listen for messages being sent
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
});

console.log("Listening on port " + port);