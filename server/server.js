"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//socket.io and http modules
const http_1 = require("http");
const socket_io_1 = require("socket.io");
//importing chess game
const chess_1 = require("./chess");
const game = new chess_1.Chess;
//creating http server
const httpServer = (0, http_1.createServer)();
const io = new socket_io_1.Server(httpServer);
let players = { "whitePlayer": "", "blackPlayer": "", "spectator": [] };
function assingColor(socket) {
    if (players.whitePlayer == "") {
        players.whitePlayer = socket.id;
        return "white";
    }
    if (players.blackPlayer == "") {
        players.blackPlayer = socket.id;
        return "black";
    }
    players.spectator.push(socket.id);
    return "spectator";
}
function removeAndReassign(socket) {
    if (players.whitePlayer == socket.id) {
        players.whitePlayer = "";
        if (players.spectator[0] != undefined) {
            players.whitePlayer = players.spectator[0];
        }
        players.spectator.shift();
        return "white";
    }
    if (players.blackPlayer == socket.id) {
        players.blackPlayer = "";
        if (players.spectator[0] != undefined) {
            players.blackPlayer = players.spectator[0];
        }
        players.spectator.shift();
        return "black";
    }
    for (let i in players.spectator) {
        if (players.spectator[parseInt(i)] == socket.id) {
            players.spectator.splice(parseInt(i), 1);
            return "spectator";
        }
    }
}
function rightTurn(socket) {
    if (game.getTurn(game.turn) == "white") {
        if (socket.id == players.whitePlayer) {
            return true;
        }
    }
    if (game.getTurn(game.turn) == "black") {
        if (socket.id == players.blackPlayer) {
            return true;
        }
    }
    return false;
}
//emit game board on connection
io.on("connection", (socket) => {
    //assign color to new connection
    console.log(socket.id, "joined as", assingColor(socket));
    //emit game board to new connection
    io.emit("game", players, game);
    //on move from player
    socket.on("game", (x1, y1, x2, y2, promote) => {
        //checks if move is from the right player
        if (rightTurn(socket)) {
            //tries to play move
            console.log(game.move(parseInt(x1), parseInt(y1), parseInt(x2), parseInt(y2), promote));
            //emit game board to all
            io.emit("game", players, game);
        }
    });
    //on disconnection
    socket.on('disconnect', () => {
        //remove disconnected player from color and reassing poisition to spectator
        console.log(socket.id, "disconnected from", removeAndReassign(socket));
        io.emit("game", players, game);
    });
});
//create http server on port 3000    
httpServer.listen(3000);
