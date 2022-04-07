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
    console.log("\n");
}
showBoard();
game.move(3, 1, 3, 3);
showBoard();
game.move(4, 1, 4, 2);
showBoard();
game.move(2, 0, 5, 3);
showBoard();
game.move(6, 7, 5, 5);
showBoard();
game.move(4, 2, 4, 3);
showBoard();
game.move(4, 3, 4, 4);
showBoard();
game.move(4, 4, 5, 5);
showBoard();
