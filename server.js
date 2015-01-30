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
        console.log("user connected");
        
        var nonFullGames = games.filter(function(game){return game.players.length < 2});
        if (nonFullGames.length > 0) {
            var chosenGame = nonFullGames[Math.floor(Math.random() * nonFullGames.length)];
            chosenGame.players.push(socket);
            
            socket.emit("join game", {
                gameID: chosenGame.id
            });
        } else {
            var gameObject = {
                id: new Date().getTime().toString() + Math.round(Math.random() * 10000),
                players: [socket]
            };
            games.push(gameObject);
            
            socket.emit("join game", {
                gameID: gameObject.id
            });
        }
        
        socket.on("fill box", function(data){
            console.log("user filled box: " + data.boxI);
            
            var game = games.filter(function(game){
                return game.players.indexOf(socket) !== -1;
            })[0];
            
            var opponentSocket = game.players.filter(function(playerSocket){
                return playerSocket !== socket;
            })[0];
            
            if (opponentSocket) {
                opponentSocket.emit("fill box", {
                    boxI: data.boxI
                });
            }
        });
    });
    
    socket.on("disconnect", function(){
        console.log("user disconnected");
        
        games.forEach(function(game, i){
            if (game.players.indexOf(socket) !== -1) {
                var opponentSocket = game.players.filter(function(playerSocket){
                    return playerSocket !== socket;
                })[0];
                if (opponentSocket) {
                    opponentSocket.emit("opp left");
                }
                games.splice(i, 1);
            }
        });
    });
});

server.listen(port, function(){
    console.log("Server running on *:" + port);
});