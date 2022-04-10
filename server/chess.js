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
    }
    Chess.prototype.move = function (x1, y1, x2, y2) {
        if (this.board[y1][x1].canMove(x1, y1, x2, y2, this.board)) {
            this.board[y2][x2] = this.board[y1][x1];
            this.board[y1][x1] = new Empty;
        }
        else {
            console.log("Cannot move piece on x: " + x1 + " y: " + y1 + " to x: " + x2 + " y: " + y2);
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
    return Piece;
}());
var Empty = /** @class */ (function () {
    function Empty() {
        this.type = "empty";
        // this.notation = "□"
        this.notation = ".";
        this.consoleColor = "\x1b[32m";
    }
    Empty.prototype.canMove = function () {
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
        if ((x2 == x1 + 1 || x2 == x1 - 1 || y2 == y1 + 1 || y2 == y1 - 1) && (board[y2][x2].type == "empty" || board[y2][x2].color != this.color)) {
            return true;
        }
        return false;
    };
    return King;
}(Piece));
