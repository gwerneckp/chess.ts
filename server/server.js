"use strict";
exports.__esModule = true;
//socket.io and http modules
var http_1 = require("http");
var socket_io_1 = require("socket.io");
//importing chess game
var chess_1 = require("./chess");
var game = new chess_1.Chess;
//creating http server
var httpServer = (0, http_1.createServer)();
var io = new socket_io_1.Server(httpServer);
//emit game board on connection
io.on("connection", function (socket) {
    io.emit("game", game.board);
    socket.on("game", function (x1, y1, x2, y2) {
        console.log(game.move(x1, y1, x2, y2));
        io.emit("game", game.board);
    });
});
//create http server on port 3000    
httpServer.listen(3000);