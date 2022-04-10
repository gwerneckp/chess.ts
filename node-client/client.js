"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
//client.js
var socket_io_client_1 = require("socket.io-client");
//user input
var prompt_sync_1 = __importDefault(require("prompt-sync"));
var prompt = (0, prompt_sync_1["default"])();
// @ts-ignore 
var socket = socket_io_client_1.io.connect('http://localhost:3000', { reconnect: true });
//defining showboard function
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
    var moveStr = prompt("next move: ");
    var moveArr = moveStr.split(" ");
    socket.emit("game", moveArr[0][0], moveArr[0][1], moveArr[1][0], moveArr[1][1]);
});