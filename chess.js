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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chess = void 0;
var Chess = /** @class */ (function () {
    function Chess() {
        this.board = [
            [
                new Pawn("white"),
                new Knight("white"),
                new Pawn("white"),
                new Pawn("white"),
                new Pawn("white"),
                new Pawn("white"),
                new Knight("white"),
                new Pawn("white")
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
                new Pawn("black"),
                new Knight("black"),
                new Pawn("black"),
                new Pawn("black"),
                new Pawn("black"),
                new Pawn("black"),
                new Knight("black"),
                new Pawn("black")
            ]
        ];
    }
    Chess.prototype.move = function (x1, y1, x2, y2) {
        if (this.board[y1][x1].canMove(x1, y1, x2, y2, this.board)) {
            this.board[y2][x2] = this.board[y1][x1];
            this.board[y1][x1] = new Empty;
        }
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
    Piece.prototype.getCords = function () {
    };
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
        console.log("You cannot move this piece. Position: x:", +x1 + " y:", +y1);
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
                //moving 2 forward
                if (y1 == 1 && y2 == 3) {
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
                if (y1 == 6 && y2 == 4) {
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
    //0,1,2,2
    // defining canMove method
    Knight.prototype.canMove = function (x1, y1, x2, y2, board) {
        if (board[y2][x2].type == "empty" || board[y2][x2].color != this.color) {
            //first rectangle
            if (Math.abs(x1 - x2) == 2) {
                if (Math.abs(y1 - y2) == 1) {
                    return true;
                }
            }
            //second rectangle
            if (Math.abs(y1 - y2) == 2) {
                if (Math.abs(x1 - x2) == 1) {
                    return true;
                }
            }
            return false;
        }
    };
    return Knight;
}(Piece));
