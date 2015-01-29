var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);

var port = 8000;

app.use(express.static(__dirname + '/public'));

app.get("/", function (req, res) {
    res.sendFile("index.html");
});

var games = [];

io.on("connection", function (socket) {
    socket.on("join", function(data){
        var nonFullGames = games.filter(function(game){return game.players.length < 2});
        if (nonFullGames.length > 0) {
            var chosenGame = nonFullGames[Math.floor(Math.random() * nonFullGames.length)];
            chosenGame.players.push(socket);
            
            socket.emit("join-game", {
                gameID: chosenGame.id
            });
        } else {
            var gameObject = {
                id: new Date().getTime().toString() + Math.round(Math.random() * 10000),
                players: [socket]
            };
            games.push(gameObject);
            
            socket.emit("join-game", {
                gameID: gameObject.id
            });
        }
        console.log(games);
    });
});

server.listen(port, function(){
    console.log("Server running on *:" + port);
});