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
    var letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
    var boardPrint = "";
    for (var i = board.length - 1; i > -1; i--) {
        var line = "";
        boardPrint += "" + (i + 1) + " ";
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
        boardPrint += letters[k];
        boardPrint += " ";
    }
    return boardPrint;
}
// Add a connect listener
socket.on('connect', function (socket) {
    console.log('Connected!');
});
function showTurn(turn) {
    var turnColor;
    if (turn[0] == "white") {
        turnColor = "\x1b[37m";
    }
    if (turn[0] == "black") {
        turnColor = "\x1b[33m";
    }
    return (turnColor + turn[0] + "'s turn" + "\x1b[0m");
}
function letterToNumber(ltr) {
    var letters = { "a": 0, "b": 1, "c": 2, "d": 3, "e": 4, "f": 5, "g": 6, "h": 7 };
    return letters[ltr];
}
function notationToNumbers(moveStr) {
    var moveArr = [];
    var arr = moveStr.split(" ");
    moveArr[0] = letterToNumber(arr[0][0]);
    moveArr[1] = parseInt(arr[0][1]) - 1;
    moveArr[2] = letterToNumber(arr[1][0]);
    moveArr[3] = parseInt(arr[1][1]) - 1;
    return moveArr;
}
socket.on("game", function (chess) {
    var move;
    console.log("\n");
    console.log(showBoard(chess.board));
    console.log("\n");
    console.log(showTurn(chess.turn));
    var moveStr = prompt("next move: ");
    move = notationToNumbers(moveStr);
    socket.emit("game", move[0], move[1], move[2], move[3]);
});
