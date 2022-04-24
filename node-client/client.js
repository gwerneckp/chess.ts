"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//client.js
const socket_io_client_1 = require("socket.io-client");
//user input
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const prompt = (0, prompt_sync_1.default)();
// @ts-ignore 
var socket = socket_io_client_1.io.connect('http://localhost:3000', { reconnection: true });
let sessionId;
socket.on('connect', function () {
    sessionId = socket.id;
});
//defining showboardwhite function
function showBoardWhite(board) {
    const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
    let boardPrint = "";
    for (let i = board.length - 1; i > -1; i--) {
        let line = "";
        boardPrint += "" + (i + 1) + " ";
        boardPrint += "  ";
        for (let j = 0; j < board[i].length; j++) {
            line += board[i][j].consoleColor + board[i][j].notation + '\x1b[0m';
            line += " ";
        }
        boardPrint += line;
        boardPrint += "\n";
    }
    boardPrint += "\n";
    boardPrint += "    ";
    for (let k = 0; k < 8; k++) {
        boardPrint += letters[k];
        boardPrint += " ";
    }
    return boardPrint;
}
//defining showboardblack function
function showBoardBlack(board) {
    const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
    let boardPrint = "";
    for (let i = 0; i < board.length; i++) {
        let line = "";
        boardPrint += "" + (i + 1) + " ";
        boardPrint += "  ";
        for (let j = board[i].length - 1; j > -1; j--) {
            line += board[i][j].consoleColor + board[i][j].notation + '\x1b[0m';
            line += " ";
        }
        boardPrint += line;
        boardPrint += "\n";
    }
    boardPrint += "\n";
    boardPrint += "    ";
    for (let k = 7; k > -1; k--) {
        boardPrint += letters[k];
        boardPrint += " ";
    }
    return boardPrint;
}
function showBoard(players, chess) {
    if (sessionId == players.whitePlayer) {
        return showBoardWhite(chess.board);
    }
    if (sessionId == players.blackPlayer) {
        return showBoardBlack(chess.board);
    }
    if (chess.turn[0] == "white") {
        return showBoardWhite(chess.board);
    }
    if (chess.turn[0] == "black") {
        return showBoardBlack(chess.board);
    }
}
// Add a connect listener
socket.on('connect', function (socket) {
    console.log('Connected!');
});
function showTurn(turn) {
    let turnColor;
    if (turn[0] == "white") {
        turnColor = "\x1b[37m";
    }
    if (turn[0] == "black") {
        turnColor = "\x1b[33m";
    }
    return (turnColor + turn[0] + "'s turn" + "\x1b[0m");
}
function letterToNumber(ltr) {
    const letters = { "a": 0, "b": 1, "c": 2, "d": 3, "e": 4, "f": 5, "g": 6, "h": 7 };
    return letters[ltr];
}
function notationToNumbers(moveStr) {
    let moveArr = [];
    let arr = moveStr.split(" ");
    moveArr[0] = letterToNumber(arr[0][0]);
    moveArr[1] = parseInt(arr[0][1]) - 1;
    moveArr[2] = letterToNumber(arr[1][0]);
    moveArr[3] = parseInt(arr[1][1]) - 1;
    return moveArr;
}
function rightTurn(players, chess) {
    if (chess.turn[0] == "white") {
        if (sessionId == players.whitePlayer) {
            return true;
        }
    }
    if (chess.turn[0] == "black") {
        if (sessionId == players.blackPlayer) {
            return true;
        }
    }
    return false;
}
socket.on("game", function (players, chess) {
    let move;
    console.log("\n");
    console.log(showBoard(players, chess));
    console.log("\n");
    console.log(showTurn(chess.turn));
    if (rightTurn(players, chess)) {
        const moveStr = prompt("next move: ");
        move = notationToNumbers(moveStr);
        console.log(move);
        socket.emit("game", move[0], move[1], move[2], move[3]);
    }
});
