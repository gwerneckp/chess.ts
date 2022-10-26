"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chess = void 0;
const lodash_1 = require("lodash");
class Names {
}
// colors
Names.WHITE = 'white';
Names.BLACK = 'black';
// types
Names.PAWN = 'pawn';
Names.ROOK = 'rook';
Names.BISHOP = 'bishop';
Names.KNIGHT = 'knight';
Names.KING = 'king';
Names.QUEEN = 'queen';
// move types
Names.DEFAULT = 'default';
Names.ILLEGAL = 'illegal';
Names.PROMOTION = 'promotion';
Names.PASSANT = 'passant';
class Chess {
    constructor() {
        this.board = [
            [
                new Rook(Names.WHITE),
                new Knight(Names.WHITE),
                new Bishop(Names.WHITE),
                new Queen(Names.WHITE),
                new King(Names.WHITE),
                new Bishop(Names.WHITE),
                new Knight(Names.WHITE),
                new Rook(Names.WHITE)
            ],
            [
                new Pawn(Names.WHITE),
                new Pawn(Names.WHITE),
                new Pawn(Names.WHITE),
                new Pawn(Names.WHITE),
                new Pawn(Names.WHITE),
                new Pawn(Names.WHITE),
                new Pawn(Names.WHITE),
                new Pawn(Names.WHITE)
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
                new Pawn(Names.BLACK),
                new Pawn(Names.BLACK),
                new Pawn(Names.BLACK),
                new Pawn(Names.BLACK),
                new Pawn(Names.BLACK),
                new Pawn(Names.BLACK),
                new Pawn(Names.BLACK),
                new Pawn(Names.BLACK)
            ],
            [
                new Rook(Names.BLACK),
                new Knight(Names.BLACK),
                new Bishop(Names.BLACK),
                new Queen(Names.BLACK),
                new King(Names.BLACK),
                new Bishop(Names.BLACK),
                new Knight(Names.BLACK),
                new Rook(Names.BLACK)
            ]
        ];
        this.turn = [Names.WHITE, Names.BLACK];
        this.history = [];
        this.history.push((0, lodash_1.cloneDeep)(this.board));
    }
    move(x1, y1, x2, y2, promote) {
        const pieceType = this.board[y1][x1].type;
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
        let moveType = this.board[y1][x1].canMove(x1, y1, x2, y2, this.board);
        if (moveType === 'illegal') {
            return ("Cannot move piece on x: " + x1 + " y: " + y1 + " to x: " + x2 + " y: " + y2);
        }
        //check if move is outting yourself in check
        if (this.inCheckAfterMove(x1, y1, x2, y2, this.board, moveType, this.turn, promote)) {
            return ("Moving piece on x: " + x1 + " y: " + y1 + " to x: " + x2 + " y: " + y2 + " leaves king in check!");
        }
        //do this if didn't return till now
        this.board = this.changePieceLocation(this.board, x1, y1, x2, y2, moveType, promote);
        this.turn = [this.turn[1], this.turn[0]];
        this.history.push((0, lodash_1.cloneDeep)(this.board));
        return ("Moved " + pieceType + " from x:" + x1 + " y:" + y1 + " to x:" + x2 + " y:" + y2);
    }
    inCheck(board, turn) {
        let myKingPos;
        let opponentPiecesPos = [];
        for (let i in board) {
            for (let j in board[i]) {
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
        for (let i in opponentPiecesPos) {
            //if piece can move to king's position, then king is in check
            if (board[opponentPiecesPos[i][0]][opponentPiecesPos[i][1]].canMove(opponentPiecesPos[i][1], opponentPiecesPos[i][0], myKingPos[1], myKingPos[0], board) !== 'illegal') {
                console.log("The " + turn[0] + "'s king is in check");
                return true;
            }
        }
        return false;
    }
    inCheckAfterMove(x1, y1, x2, y2, board, moveType, turn, promote) {
        //creates clone of board
        let newBoard = (0, lodash_1.cloneDeep)(board);
        //moves piece in cloned board
        newBoard = this.changePieceLocation(newBoard, x1, y1, x2, y2, moveType, promote);
        //if move puts king on check, return true
        if (this.inCheck(newBoard, turn)) {
            return true;
        }
        return false;
    }
    changePieceLocation(board, x1, y1, x2, y2, moveType, promote) {
        if (moveType === 'regular') {
            board[y1][x1].changeHasMoved();
            board[y2][x2] = board[y1][x1];
            board[y1][x1] = new Empty;
            return board;
        }
        if (moveType === 'shortCastle') {
            board[y1][x1].changeHasMoved();
            board[y1][7].changeHasMoved();
            board[y2][x2] = board[y1][x1];
            board[y1][x1] = new Empty;
            board[y1][5] = board[y1][7];
            board[y1][7] = new Empty;
            return board;
        }
        if (moveType === 'longCastle') {
            board[y1][x1].changeHasMoved();
            board[y1][0].changeHasMoved();
            board[y2][x2] = board[y1][x1];
            board[y1][x1] = new Empty;
            board[y1][3] = board[y1][0];
            board[y1][0] = new Empty;
            return board;
        }
        if (moveType === 'en passant') {
            //do stuff
        }
        if (moveType === 'promote') {
            board[y1][x1].changeHasMoved();
            switch (promote) {
                case undefined:
                    board[y2][x2] = new Queen(board[y1][x1].color);
                    break;
                case 'q':
                    board[y2][x2] = new Queen(board[y1][x1].color);
                    break;
                case 'b':
                    board[y2][x2] = new Bishop(board[y1][x1].color);
                    break;
                case 'n':
                    board[y2][x2] = new Knight(board[y1][x1].color);
                    break;
                case 'r':
                    board[y2][x2] = new Rook(board[y1][x1].color);
                    break;
                default:
                    board[y2][x2] = new Queen(board[y1][x1].color);
                    break;
            }
            board[y1][x1] = new Empty;
            return board;
        }
    }
    inCheckmate(board, turn) {
        //check if king is in check
        if (this.inCheck(board, turn)) {
            //two nested loops to iterate throught all pieces in board
            for (let i in board) {
                for (let j in board[i]) {
                    //if piece is of the same color of turn
                    if (board[i][j].color == turn[0]) {
                        //two nested loops to iterate throught all pieces in board
                        for (let k in board) {
                            for (let l in board[k]) {
                                //checks if any  move can take king out of check
                                let canMove = board[i][j].canMove(parseInt(j), parseInt(i), parseInt(l), parseInt(k), board);
                                if (canMove !== 'illegal' && !this.inCheckAfterMove(parseInt(j), parseInt(i), parseInt(l), parseInt(k), board, canMove, turn)) {
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
    }
    inStalemate(board, turn) {
        //check if king is NOT in check
        if (!this.inCheck(board, turn)) {
            //two nested loops to iterate throught all pieces in board
            for (let i in board) {
                for (let j in board[i]) {
                    if (board[i][j].color == turn[0]) {
                        //two nested loops to iterate throught all pieces in board
                        for (let k in board) {
                            for (let l in board[i]) {
                                //checks if piece can move and if king is not in check after move
                                let canMove = board[i][j].canMove(parseInt(j), parseInt(i), parseInt(l), parseInt(k), board);
                                if (board[i][j].canMove(parseInt(j), parseInt(i), parseInt(l), parseInt(k), board) !== 'illegal' && !this.inCheckAfterMove(parseInt(j), parseInt(i), parseInt(l), parseInt(k), board, canMove, turn)) {
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
    }
}
exports.Chess = Chess;
class Piece {
    // constructor
    constructor(clr) {
        this.color = clr;
        this.hasMoved = false;
    }
    //set hasMoved to true
    changeHasMoved() {
        this.hasMoved = true;
    }
}
class Empty {
    constructor() {
        this.type = "empty";
        this.notation = ".";
    }
    canMove(x1, y1, x2, y2, board) {
        return 'illegal';
    }
}
class Pawn extends Piece {
    constructor(clr) {
        super(clr);
        this.type = "pawn";
        this.notation = "p";
        this.canBeTakenEnPassant = false;
    }
    // defining canMove method
    canMove(x1, y1, x2, y2, board) {
        //for white
        if (this.color == Names.WHITE) {
            //moving forward
            if (x1 == x2 && board[y2][x2].type == "empty") {
                //moving 1 forward
                if (y2 == y1 + 1) {
                    if (y2 == 7) {
                        return 'promote';
                    }
                    return 'regular';
                }
                //moving 2 forwards
                if (y1 == 1 && y2 == 3 && board[2][x2].type == "empty") {
                    return 'regular';
                }
            }
            //eating diagonally
            if ((x2 == x1 + 1 || x2 == x1 - 1) && y2 == y1 + 1 && board[y2][x2].type != "empty") {
                if (board[y2][x2].color != Names.WHITE) {
                    if (y2 == 7) {
                        return 'promote';
                    }
                    return 'regular';
                }
            }
        }
        //for black
        if (this.color == Names.BLACK) {
            //moving forward
            if (x1 == x2 && board[y2][x2].type == "empty") {
                //moving 1 forward
                if (y2 == y1 - 1) {
                    if (y2 == 0) {
                        return 'promote';
                    }
                    return 'regular';
                }
                //moving 2 forward
                if (y1 == 6 && y2 == 4 && board[5][x2].type == "empty") {
                    return 'regular';
                }
            }
            //eating diagonally
            if ((x2 == x1 + 1 || x2 == x1 - 1) && y2 == y1 - 1 && board[y2][x2].type != "empty") {
                if (board[y2][x2].color != Names.BLACK) {
                    if (y2 == 0) {
                        return 'promote';
                    }
                    return 'regular';
                }
            }
        }
        return 'illegal';
    }
}
class Knight extends Piece {
    //constructor
    constructor(clr) {
        super(clr);
        this.type = "knight";
        this.notation = "n";
    }
    //defining canMove method
    canMove(x1, y1, x2, y2, board) {
        if (board[y2][x2].type == "empty" || board[y2][x2].color != this.color) {
            //first rectangle
            if (Math.abs(x1 - x2) == 2 && Math.abs(y1 - y2) == 1) {
                return 'regular';
            }
            //second rectangle
            if (Math.abs(y1 - y2) == 2 && Math.abs(x1 - x2) == 1) {
                return 'regular';
            }
            return 'illegal';
        }
        return 'illegal';
    }
}
class Rook extends Piece {
    //constructor
    constructor(clr) {
        super(clr);
        this.type = "rook";
        this.notation = "r";
    }
    // defining canMove method
    canMove(x1, y1, x2, y2, board) {
        //horizontal
        if (x1 == x2) {
            //if positive
            if ((y2 - y1) > 0) {
                //check all cases before target
                for (let i = 1; i < Math.abs(y2 - y1); i++) {
                    if (board[y1 + i][x2].type != "empty") {
                        return 'illegal';
                    }
                }
                //checks if case is empty or if there is an opponent piece
                if (board[y2][x2].type == "empty" || board[y2][x2].color != this.color) {
                    return 'regular';
                }
            }
            //if negative
            if ((y2 - y1) < 0) {
                //check all cases before target
                for (let i = 1; i < Math.abs(y2 - y1); i++) {
                    if (board[y1 - i][x2].type != "empty") {
                        return 'illegal';
                    }
                }
                //checks if case is empty or if there is an opponent piece
                if (board[y2][x2].type == "empty" || board[y2][x2].color != this.color) {
                    return 'regular';
                }
            }
        }
        //vertical
        if (y1 == y2) {
            //if positive
            if ((x2 - x1) > 0) {
                //check all cases before target
                for (let i = 1; i < Math.abs(x2 - x1); i++) {
                    if (board[y2][x1 + i].type != "empty") {
                        return 'illegal';
                    }
                }
                //checks if case is empty or if there is an opponent piece
                if (board[y2][x2].type == "empty" || board[y2][x2].color != this.color) {
                    return 'regular';
                }
            }
            //if negative
            if ((x2 - x1) < 0) {
                //check all cases before target
                for (let i = 1; i < Math.abs(x2 - x1); i++) {
                    if (board[y2][x1 - i].type != "empty") {
                        return 'illegal';
                    }
                }
                //checks if case is empty or if there is an opponent piece
                if (board[y2][x2].type == "empty" || board[y2][x2].color != this.color) {
                    return 'regular';
                }
            }
        }
        return 'illegal';
    }
}
class Bishop extends Piece {
    //constructor
    constructor(clr) {
        super(clr);
        this.type = "bishop";
        this.notation = "b";
    }
    //defining canMove method
    canMove(x1, y1, x2, y2, board) {
        if (Math.abs(x2 - x1) == Math.abs(y2 - y1)) {
            //right side
            if ((x2 - x1) > 0) {
                //up
                if ((y2 - y1) > 0) {
                    //check all cases before target
                    for (let i = 1; i < Math.abs(x2 - x1); i++) {
                        if (board[y1 + i][x1 + i].type != "empty") {
                            return 'illegal';
                        }
                    }
                    //checks if case is empty or if there is an opponent piece
                    if (board[y2][x2].type == "empty" || board[y2][x2].color != this.color) {
                        return 'regular';
                    }
                }
                //down
                if ((y2 - y1) < 0) {
                    //check all cases before target
                    for (let i = 1; i < Math.abs(x2 - x1); i++) {
                        if (board[y1 - i][x1 + i].type != "empty") {
                            return 'illegal';
                        }
                    }
                    //checks if case is empty or if there is an opponent piece
                    if (board[y2][x2].type == "empty" || board[y2][x2].color != this.color) {
                        return 'regular';
                    }
                }
            }
            //left side
            if ((x2 - x1) < 0) {
                //up
                if ((y2 - y1) > 0) {
                    //check all cases before target
                    for (let i = 1; i < Math.abs(x2 - x1); i++) {
                        if (board[y1 + i][x1 - i].type != "empty") {
                            return 'illegal';
                        }
                    }
                    //checks if case is empty or if there is an opponent piece
                    if (board[y2][x2].type == "empty" || board[y2][x2].color != this.color) {
                        return 'regular';
                    }
                }
                //down
                if ((y2 - y1) < 0) {
                    //check all cases before target
                    for (let i = 1; i < Math.abs(x2 - x1); i++) {
                        if (board[y1 - i][x1 - i].type != "empty") {
                            return 'illegal';
                        }
                    }
                    //checks if case is empty or if there is an opponent piece
                    if (board[y2][x2].type == "empty" || board[y2][x2].color != this.color) {
                        return 'regular';
                    }
                }
            }
        }
        return 'illegal';
    }
}
class Queen extends Piece {
    //constructor
    constructor(clr) {
        super(clr);
        this.type = "queen";
        this.notation = "q";
    }
    // defining canMove method
    canMove(x1, y1, x2, y2, board) {
        if (Math.abs(x2 - x1) == Math.abs(y2 - y1)) {
            //right side diagonal
            if ((x2 - x1) > 0) {
                //up
                if ((y2 - y1) > 0) {
                    //check all cases before target
                    for (let i = 1; i < Math.abs(x2 - x1); i++) {
                        if (board[y1 + i][x1 + i].type != "empty") {
                            return 'illegal';
                        }
                    }
                    //checks if case is empty or if there is an opponent piece
                    if (board[y2][x2].type == "empty" || board[y2][x2].color != this.color) {
                        return 'regular';
                    }
                }
                //down
                if ((y2 - y1) < 0) {
                    //check all cases before target
                    for (let i = 1; i < Math.abs(x2 - x1); i++) {
                        if (board[y1 - i][x1 + i].type != "empty") {
                            return 'illegal';
                        }
                    }
                    //checks if case is empty or if there is an opponent piece
                    if (board[y2][x2].type == "empty" || board[y2][x2].color != this.color) {
                        return 'regular';
                    }
                }
            }
            //left side diagonal
            if ((x2 - x1) < 0) {
                //up
                if ((y2 - y1) > 0) {
                    //check all cases before target
                    for (let i = 1; i < Math.abs(x2 - x1); i++) {
                        if (board[y1 + i][x1 - i].type != "empty") {
                            return 'illegal';
                        }
                    }
                    //checks if case is empty or if there is an opponent piece
                    if (board[y2][x2].type == "empty" || board[y2][x2].color != this.color) {
                        return 'regular';
                    }
                }
                //down
                if ((y2 - y1) < 0) {
                    //check all cases before target
                    for (let i = 1; i < Math.abs(x2 - x1); i++) {
                        if (board[y1 - i][x1 - i].type != "empty") {
                            return 'illegal';
                        }
                    }
                    //checks if case is empty or if there is an opponent piece
                    if (board[y2][x2].type == "empty" || board[y2][x2].color != this.color) {
                        return 'regular';
                    }
                }
            }
        }
        //horizontal
        if (x1 == x2) {
            //if positive
            if ((y2 - y1) > 0) {
                //check all cases before target
                for (let i = 1; i < Math.abs(y2 - y1); i++) {
                    if (board[y1 + i][x2].type != "empty") {
                        return 'illegal';
                    }
                }
                //checks if case is empty or if there is an opponent piece
                if (board[y2][x2].type == "empty" || board[y2][x2].color != this.color) {
                    return 'regular';
                }
            }
            //if negative
            if ((y2 - y1) < 0) {
                //check all cases before target
                for (let i = 1; i < Math.abs(y2 - y1); i++) {
                    if (board[y1 - i][x2].type != "empty") {
                        return 'illegal';
                    }
                }
                //checks if case is empty or if there is an opponent piece
                if (board[y2][x2].type == "empty" || board[y2][x2].color != this.color) {
                    return 'regular';
                }
            }
        }
        //vertical
        if (y1 == y2) {
            //if positive
            if ((x2 - x1) > 0) {
                //check all cases before target
                for (let i = 1; i < Math.abs(x2 - x1); i++) {
                    if (board[y2][x1 + i].type != "empty") {
                        return 'illegal';
                    }
                }
                //checks if case is empty or if there is an opponent piece
                if (board[y2][x2].type == "empty" || board[y2][x2].color != this.color) {
                    return 'regular';
                }
            }
            //if negative
            if ((x2 - x1) < 0) {
                //check all cases before target
                for (let i = 1; i < Math.abs(x2 - x1); i++) {
                    if (board[y2][x1 - i].type != "empty") {
                        return 'illegal';
                    }
                }
                //checks if case is empty or if there is an opponent piece
                if (board[y2][x2].type == "empty" || board[y2][x2].color != this.color) {
                    return 'regular';
                }
            }
        }
        return 'illegal';
    }
}
class King extends Piece {
    //constructor
    constructor(clr) {
        super(clr);
        this.type = "king";
        this.notation = "k";
        this.hasMoved = false;
    }
    // defining canMove method
    canMove(x1, y1, x2, y2, board) {
        if ((x2 == x1 + 1 || x2 == x1 - 1 || y2 == y1 + 1 || y2 == y1 - 1) && (board[y2][x2].type == "empty" || board[y2][x2].color != this.color) && Math.abs(x2 - x1) < 2 && Math.abs(y2 - y1) < 2) {
            return 'regular';
        }
        if (this.color === 'white') {
            //check if trying to short castle
            if (y1 == 0 && x1 == 4 && y2 == 0 && x2 == 6) {
                //check if all cases are empty and rook there
                if (board[0][5].type == "empty" && board[0][6].type == "empty" && board[0][7].type == "rook") {
                    //check if any of the pieces have moved
                    if (!this.hasMoved && !board[0][7].hasMoved) {
                        return 'shortCastle';
                    }
                }
            }
            //check if trying to long castle
            if (y1 == 0 && x1 == 4 && y2 == 0 && x2 == 2) {
                //check if all cases are empty and rook there
                if (board[0][3].type == "empty" && board[0][2].type == "empty" && board[0][1].type == "empty" && board[0][0].type == "rook") {
                    //check if any of the pieces have moved
                    if (!this.hasMoved && !board[0][0].hasMoved) {
                        return 'longCastle';
                    }
                }
            }
        }
        if (this.color === 'black') {
            //check if trying to short castle
            if (y1 == 7 && x1 == 4 && y2 == 7 && x2 == 6) {
                //check if all cases are empty and rook there
                if (board[7][5].type == "empty" && board[7][6].type == "empty" && board[7][7].type == "rook") {
                    //check if any of the pieces have moved
                    if (!this.hasMoved && !board[7][7].hasMoved) {
                        return 'shortCastle';
                    }
                }
            }
            //check if trying to long castle
            if (y1 == 7 && x1 == 4 && y2 == 7 && x2 == 2) {
                //check if all cases are empty and rook there
                if (board[7][3].type == "empty" && board[7][2].type == "empty" && board[7][1].type == "empty" && board[7][0].type == "rook") {
                    //check if any of the pieces have moved
                    if (!this.hasMoved && !board[7][0].hasMoved) {
                        return 'longCastle';
                    }
                }
            }
        }
        return 'illegal';
    }
}
