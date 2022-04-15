"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.Chess = void 0;
var lodash_1 = require("lodash");
var Chess = /** @class */ (function () {
    function Chess() {
        this.board = [
            [
                new Rook("white"),
                new Knight("white"),
                new Bishop("white"),
                new Queen("white"),
                new King("white"),
                new Bishop("white"),
                new Knight("white"),
                new Rook("white")
            ],
            [
                new Pawn("white"),
                new Pawn("white"),
                new Pawn("white"),
                new Pawn("white"),
                new Pawn("white"),
                new Pawn("white"),
                new Pawn("white"),
                new Pawn("white")
            ],
            [
                new Empty,
                new Empty,
                new Empty,
                new Empty,
                new Empty,
                new Empty,
                new Empty,
                new Empty
            ],
            [
                new Empty,
                new Empty,
                new Empty,
                new Empty,
                new Empty,
                new Empty,
                new Empty,
                new Empty
            ],
            [
                new Empty,
                new Empty,
                new Empty,
                new Empty,
                new Empty,
                new Empty,
                new Empty,
                new Empty
            ],
            [
                new Empty,
                new Empty,
                new Empty,
                new Empty,
                new Empty,
                new Empty,
                new Empty,
                new Empty
            ],
            [
                new Pawn("black"),
                new Pawn("black"),
                new Pawn("black"),
                new Pawn("black"),
                new Pawn("black"),
                new Pawn("black"),
                new Pawn("black"),
                new Pawn("black")
            ],
            [
                new Rook("black"),
                new Knight("black"),
                new Bishop("black"),
                new Queen("black"),
                new King("black"),
                new Bishop("black"),
                new Knight("black"),
                new Rook("black")
            ]
        ];
        this.turn = ["white", "black"];
    }
    Chess.prototype.move = function (x1, y1, x2, y2) {
        var pieceType = this.board[y1][x1].type;
        //checks if in checkmate
        if (this.inCheckmate(this.board, this.turn)) {
            return ("Game Over! The " + this.turn[0] + " king is in checkmate!");
        }
        //checks if in stalamate
        if (this.inStalemate(this.board, this.turn)) {
            return ("Stalemate, " + this.turn[0] + " has no legal moves remaining, but is not in check. It's a draw!");
        }
        //if piece you are trying to move isn't of the same color of current turn
        if (this.board[y1][x1].color != this.turn[0]) {
            return ("Cannot move a " + this.board[y1][x1].color + " piece on " + this.turn[0] + "'s turn.");
        }
        //checks if piece can *NOT* move 
        if (!this.board[y1][x1].canMove(x1, y1, x2, y2, this.board)) {
            return ("Cannot move piece on x: " + x1 + " y: " + y1 + " to x: " + x2 + " y: " + y2);
        }
        //check if move is outting yourself in check
        if (this.inCheckAfterMove(x1, y1, x2, y2, this.board, this.turn)) {
            return ("Moving piece on x: " + x1 + " y: " + y1 + " to x: " + x2 + " y: " + y2 + " leaves king in check!");
        }
        //do this if didn't return till now
        this.board[y2][x2] = this.board[y1][x1];
        this.board[y1][x1] = new Empty;
        this.turn = [this.turn[1], this.turn[0]];
        return ("Moved " + pieceType + " from x:" + x1 + " y:" + y1 + " to x:" + x2 + " y:" + y2);
    };
    Chess.prototype.inCheck = function (board, turn) {
        var myKingPos;
        var opponentPiecesPos = [];
        for (var i in board) {
            for (var j in board[i]) {
                //check if piece is of the opponent's color and save its position in array
                if (board[i][j].color == turn[1]) {
                    opponentPiecesPos.push([parseInt(i), parseInt(j)]);
                }
                //check if piece is king of the current turn's color and save its position
                if (board[i][j].type == "king" && board[i][j].color == turn[0]) {
                    myKingPos = [parseInt(i), parseInt(j)];
                }
            }
        }
        for (var i in opponentPiecesPos) {
            //if piece can move to king's position, then king is in check
            if (board[opponentPiecesPos[i][0]][opponentPiecesPos[i][1]].canMove(opponentPiecesPos[i][1], opponentPiecesPos[i][0], myKingPos[1], myKingPos[0], board)) {
                console.log("The " + turn[0] + "'s king is in check");
                return true;
            }
        }
        return false;
    };
    Chess.prototype.inCheckAfterMove = function (x1, y1, x2, y2, board, turn) {
        //creates clone of board
        var newBoard = (0, lodash_1.cloneDeep)(board);
        //moves piece in cloned board
        newBoard[y2][x2] = newBoard[y1][x1];
        newBoard[y1][x1] = new Empty;
        //if move puts king on check, return true
        if (this.inCheck(newBoard, turn)) {
            return true;
        }
        return false;
    };
    Chess.prototype.inCheckmate = function (board, turn) {
        //check if king is in check
        if (this.inCheck(board, turn)) {
            //two nested loops to iterate throught all pieces in board
            for (var i in board) {
                for (var j in board[i]) {
                    //if piece is of the same color of turn
                    if (board[i][j].color == turn[0]) {
                        //two nested loops to iterate throught all pieces in board
                        for (var k in board) {
                            for (var l in board[k]) {
                                //checks if any  move can take king out of check
                                if (board[i][j].canMove(parseInt(j), parseInt(i), parseInt(l), parseInt(k), board) && !this.inCheckAfterMove(parseInt(j), parseInt(i), parseInt(l), parseInt(k), board, turn)) {
                                    console.log("Moving piece on x: " + j + " y: " + i + " to x: " + l + " y: " + k + " takes king out of check!");
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
            return true;
        }
        return false;
    };
    Chess.prototype.inStalemate = function (board, turn) {
        //check if king is NOT in check
        if (!this.inCheck(board, turn)) {
            //two nested loops to iterate throught all pieces in board
            for (var i in board) {
                for (var j in board[i]) {
                    if (board[i][j].color == turn[0]) {
                        //two nested loops to iterate throught all pieces in board
                        for (var k in board) {
                            for (var l in board[i]) {
                                //checks if piece can move and if king is not in check after move
                                if (board[i][j].canMove(parseInt(j), parseInt(i), parseInt(l), parseInt(k), board) && !this.inCheckAfterMove(parseInt(j), parseInt(i), parseInt(l), parseInt(k), board, turn)) {
                                    console.log("Moving piece on x: " + j + " y: " + i + " to x: " + l + " y: " + k + " is possible!");
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
            return true;
        }
        return false;
    };
    return Chess;
}());
exports.Chess = Chess;
var Piece = /** @class */ (function () {
    // constructor
    function Piece(clr) {
        this.color = clr;
        if (clr == "white") {
            this.consoleColor = "\x1b[37m";
        }
        if (clr == "black") {
            this.consoleColor = "\x1b[33m";
        }
    }
    return Piece;
}());
var Empty = /** @class */ (function () {
    function Empty() {
        this.type = "empty";
        // this.notation = "□"
        this.notation = ".";
        this.consoleColor = "\x1b[32m";
    }
    Empty.prototype.canMove = function (x1, y1, x2, y2, board) {
        return false;
    };
    return Empty;
}());
var Pawn = /** @class */ (function (_super) {
    __extends(Pawn, _super);
    //constructor
    function Pawn(clr) {
        var _this = _super.call(this, clr) || this;
        _this.type = "pawn";
        _this.notation = "p";
        return _this;
    }
    // defining canMove method
    Pawn.prototype.canMove = function (x1, y1, x2, y2, board) {
        //for white
        if (this.color == "white") {
            //moving forward
            if (x1 == x2 && board[y2][x2].type == "empty") {
                //moving 1 forward
                if (y2 == y1 + 1) {
                    return true;
                }
                //moving 2 forwards
                if (y1 == 1 && y2 == 3 && board[2][x2].type == "empty") {
                    return true;
                }
            }
            //eating diagonally
            if ((x2 == x1 + 1 || x2 == x1 - 1) && y2 == y1 + 1 && board[y2][x2].type != "empty") {
                if (board[y2][x2].color != "white") {
                    return true;
                }
            }
        }
        //for black
        if (this.color == "black") {
            //moving forward
            if (x1 == x2 && board[y2][x2].type == "empty") {
                //moving 1 forward
                if (y2 == y1 - 1) {
                    return true;
                }
                //moving 2 forward
                if (y1 == 6 && y2 == 4 && board[5][x2].type == "empty") {
                    return true;
                }
            }
            //eating diagonally
            if ((x2 == x1 + 1 || x2 == x1 - 1) && y2 == y1 - 1 && board[y2][x2].type != "empty") {
                if (board[y2][x2].color != "black") {
                    return true;
                }
            }
        }
        return false;
    };
    return Pawn;
}(Piece));
var Knight = /** @class */ (function (_super) {
    __extends(Knight, _super);
    //constructor
    function Knight(clr) {
        var _this = _super.call(this, clr) || this;
        _this.type = "knight";
        _this.notation = "n";
        return _this;
    }
    //defining canMove method
    Knight.prototype.canMove = function (x1, y1, x2, y2, board) {
        if (board[y2][x2].type == "empty" || board[y2][x2].color != this.color) {
            //first rectangle
            if (Math.abs(x1 - x2) == 2 && Math.abs(y1 - y2) == 1) {
                return true;
            }
            //second rectangle
            if (Math.abs(y1 - y2) == 2 && Math.abs(x1 - x2) == 1) {
                return true;
            }
            return false;
        }
    };
    return Knight;
}(Piece));
var Rook = /** @class */ (function (_super) {
    __extends(Rook, _super);
    //constructor
    function Rook(clr) {
        var _this = _super.call(this, clr) || this;
        _this.type = "rook";
        _this.notation = "r";
        return _this;
    }
    // defining canMove method
    Rook.prototype.canMove = function (x1, y1, x2, y2, board) {
        //horizontal
        if (x1 == x2) {
            //if positive
            if ((y2 - y1) > 0) {
                //check all cases before target
                for (var i = 1; i < Math.abs(y2 - y1); i++) {
                    if (board[y1 + i][x2].type != "empty") {
                        return false;
                    }
                }
                //checks if case is empty or if there is an opponent piece
                if (board[y2][x2].type == "empty" || board[y2][x2].color != this.color) {
                    return true;
                }
            }
            //if negative
            if ((y2 - y1) < 0) {
                //check all cases before target
                for (var i = 1; i < Math.abs(y2 - y1); i++) {
                    if (board[y1 - i][x2].type != "empty") {
                        return false;
                    }
                }
                //checks if case is empty or if there is an opponent piece
                if (board[y2][x2].type == "empty" || board[y2][x2].color != this.color) {
                    return true;
                }
            }
        }
        //vertical
        if (y1 == y2) {
            //if positive
            if ((x2 - x1) > 0) {
                //check all cases before target
                for (var i = 1; i < Math.abs(x2 - x1); i++) {
                    if (board[y2][x1 + i].type != "empty") {
                        return false;
                    }
                }
                //checks if case is empty or if there is an opponent piece
                if (board[y2][x2].type == "empty" || board[y2][x2].color != this.color) {
                    return true;
                }
            }
            //if negative
            if ((x2 - x1) < 0) {
                //check all cases before target
                for (var i = 1; i < Math.abs(x2 - x1); i++) {
                    if (board[y2][x1 - i].type != "empty") {
                        return false;
                    }
                }
                //checks if case is empty or if there is an opponent piece
                if (board[y2][x2].type == "empty" || board[y2][x2].color != this.color) {
                    return true;
                }
            }
        }
        return false;
    };
    return Rook;
}(Piece));
var Bishop = /** @class */ (function (_super) {
    __extends(Bishop, _super);
    //constructor
    function Bishop(clr) {
        var _this = _super.call(this, clr) || this;
        _this.type = "bishop";
        _this.notation = "b";
        return _this;
    }
    //defining canMove method
    Bishop.prototype.canMove = function (x1, y1, x2, y2, board) {
        if (Math.abs(x2 - x1) == Math.abs(y2 - y1)) {
            //right side
            if ((x2 - x1) > 0) {
                //up
                if ((y2 - y1) > 0) {
                    //check all cases before target
                    for (var i = 1; i < Math.abs(x2 - x1); i++) {
                        if (board[y1 + i][x1 + i].type != "empty") {
                            return false;
                        }
                    }
                    //checks if case is empty or if there is an opponent piece
                    if (board[y2][x2].type == "empty" || board[y2][x2].color != this.color) {
                        return true;
                    }
                }
                //down
                if ((y2 - y1) < 0) {
                    //check all cases before target
                    for (var i = 1; i < Math.abs(x2 - x1); i++) {
                        if (board[y1 - i][x1 + i].type != "empty") {
                            return false;
                        }
                    }
                    //checks if case is empty or if there is an opponent piece
                    if (board[y2][x2].type == "empty" || board[y2][x2].color != this.color) {
                        return true;
                    }
                }
            }
            //left side
            if ((x2 - x1) < 0) {
                //up
                if ((y2 - y1) > 0) {
                    //check all cases before target
                    for (var i = 1; i < Math.abs(x2 - x1); i++) {
                        if (board[y1 + i][x1 - i].type != "empty") {
                            return false;
                        }
                    }
                    //checks if case is empty or if there is an opponent piece
                    if (board[y2][x2].type == "empty" || board[y2][x2].color != this.color) {
                        return true;
                    }
                }
                //down
                if ((y2 - y1) < 0) {
                    //check all cases before target
                    for (var i = 1; i < Math.abs(x2 - x1); i++) {
                        if (board[y1 - i][x1 - i].type != "empty") {
                            return false;
                        }
                    }
                    //checks if case is empty or if there is an opponent piece
                    if (board[y2][x2].type == "empty" || board[y2][x2].color != this.color) {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    return Bishop;
}(Piece));
var Queen = /** @class */ (function (_super) {
    __extends(Queen, _super);
    //constructor
    function Queen(clr) {
        var _this = _super.call(this, clr) || this;
        _this.type = "queen";
        _this.notation = "q";
        return _this;
    }
    // defining canMove method
    Queen.prototype.canMove = function (x1, y1, x2, y2, board) {
        if (Math.abs(x2 - x1) == Math.abs(y2 - y1)) {
            //right side diagonal
            if ((x2 - x1) > 0) {
                //up
                if ((y2 - y1) > 0) {
                    //check all cases before target
                    for (var i = 1; i < Math.abs(x2 - x1); i++) {
                        if (board[y1 + i][x1 + i].type != "empty") {
                            return false;
                        }
                    }
                    //checks if case is empty or if there is an opponent piece
                    if (board[y2][x2].type == "empty" || board[y2][x2].color != this.color) {
                        return true;
                    }
                }
                //down
                if ((y2 - y1) < 0) {
                    //check all cases before target
                    for (var i = 1; i < Math.abs(x2 - x1); i++) {
                        if (board[y1 - i][x1 + i].type != "empty") {
                            return false;
                        }
                    }
                    //checks if case is empty or if there is an opponent piece
                    if (board[y2][x2].type == "empty" || board[y2][x2].color != this.color) {
                        return true;
                    }
                }
            }
            //left side diagonal
            if ((x2 - x1) < 0) {
                //up
                if ((y2 - y1) > 0) {
                    //check all cases before target
                    for (var i = 1; i < Math.abs(x2 - x1); i++) {
                        if (board[y1 + i][x1 - i].type != "empty") {
                            return false;
                        }
                    }
                    //checks if case is empty or if there is an opponent piece
                    if (board[y2][x2].type == "empty" || board[y2][x2].color != this.color) {
                        return true;
                    }
                }
                //down
                if ((y2 - y1) < 0) {
                    //check all cases before target
                    for (var i = 1; i < Math.abs(x2 - x1); i++) {
                        if (board[y1 - i][x1 - i].type != "empty") {
                            return false;
                        }
                    }
                    //checks if case is empty or if there is an opponent piece
                    if (board[y2][x2].type == "empty" || board[y2][x2].color != this.color) {
                        return true;
                    }
                }
            }
        }
        //horizontal
        if (x1 == x2) {
            //if positive
            if ((y2 - y1) > 0) {
                //check all cases before target
                for (var i = 1; i < Math.abs(y2 - y1); i++) {
                    if (board[y1 + i][x2].type != "empty") {
                        return false;
                    }
                }
                //checks if case is empty or if there is an opponent piece
                if (board[y2][x2].type == "empty" || board[y2][x2].color != this.color) {
                    return true;
                }
            }
            //if negative
            if ((y2 - y1) < 0) {
                //check all cases before target
                for (var i = 1; i < Math.abs(y2 - y1); i++) {
                    if (board[y1 - i][x2].type != "empty") {
                        return false;
                    }
                }
                //checks if case is empty or if there is an opponent piece
                if (board[y2][x2].type == "empty" || board[y2][x2].color != this.color) {
                    return true;
                }
            }
        }
        //vertical
        if (y1 == y2) {
            //if positive
            if ((x2 - x1) > 0) {
                //check all cases before target
                for (var i = 1; i < Math.abs(x2 - x1); i++) {
                    if (board[y2][x1 + i].type != "empty") {
                        return false;
                    }
                }
                //checks if case is empty or if there is an opponent piece
                if (board[y2][x2].type == "empty" || board[y2][x2].color != this.color) {
                    return true;
                }
            }
            //if negative
            if ((x2 - x1) < 0) {
                //check all cases before target
                for (var i = 1; i < Math.abs(x2 - x1); i++) {
                    if (board[y2][x1 - i].type != "empty") {
                        return false;
                    }
                }
                //checks if case is empty or if there is an opponent piece
                if (board[y2][x2].type == "empty" || board[y2][x2].color != this.color) {
                    return true;
                }
            }
        }
        return false;
    };
    return Queen;
}(Piece));
var King = /** @class */ (function (_super) {
    __extends(King, _super);
    //constructor
    function King(clr) {
        var _this = _super.call(this, clr) || this;
        _this.type = "king";
        _this.notation = "k";
        return _this;
    }
    // defining canMove method
    King.prototype.canMove = function (x1, y1, x2, y2, board) {
        if ((x2 == x1 + 1 || x2 == x1 - 1 || y2 == y1 + 1 || y2 == y1 - 1) && (board[y2][x2].type == "empty" || board[y2][x2].color != this.color) && Math.abs(x2 - x1) < 2 && Math.abs(y2 - y1) < 2) {
            return true;
        }
        return false;
    };
    return King;
}(Piece));
