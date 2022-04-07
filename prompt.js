"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chess_1 = require("./chess");
var game = new chess_1.Chess;
function showBoard() {
    var board = "";
    for (var i = game.board.length - 1; i > -1; i--) {
        var line = "";
        board += "" + i + " ";
        board += "  ";
        for (var j = 0; j < game.board[i].length; j++) {
            line += game.board[i][j].consoleColor + game.board[i][j].notation + '\x1b[0m';
            line += " ";
        }
        board += line;
        board += "\n";
    }
    board += "\n";
    board += "    ";
    for (var k = 0; k < 8; k++) {
        board += k;
        board += " ";
    }
    console.log(board);
}
showBoard();
console.log(game.board[1][1].color);
game.move(3, 1, 3, 3);
showBoard();
