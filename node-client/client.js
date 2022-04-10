"use strict";
exports.__esModule = true;
//client.js
var socket_io_client_1 = require("socket.io-client");
var socket = socket_io_client_1.io.connect('http://localhost:3000', { reconnect: true });
function showBoard(board) {
    var boardPrint = "";
    for (var i = board.length - 1; i > -1; i--) {
        var line = "";
        boardPrint += "" + i + " ";
        boardPrint += "  ";
        for (var j = 0; j < board[i].length; j++) {
            line += board[i][j].consoleColor + board[i][j].notation + '\x1b[0m';
            line += " ";
        }
        boardPrint += line;
        boardPrint += "\n";
    }
    boardPrint += "\n";
    boardPrint += "    ";
    for (var k = 0; k < 8; k++) {
        boardPrint += k;
        boardPrint += " ";
    }
    console.log(boardPrint);
    console.log("\n");
}
// Add a connect listener
socket.on('connect', function (socket) {
    console.log('Connected!');
});
socket.on("game", function (arg) {
    showBoard(arg);
});
