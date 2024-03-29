import { cloneDeep } from "lodash";

interface Cordianate {
  x: number;
  y: number; 
}

interface ChessMoves{
  DEFAULT: string,
  ILLEGAL: string,
  PROMOTION: string,
  PASSANT: string
  PAWN_DOUBLE: string
  SHORT_CASTLE: string
  LONG_CASTLE: string
}

interface ChessPieces{
  EMPTY: string,
  PAWN: string,
  ROOK: string,
  BISHOP: string
  KNIGHT: string
  KING: string
  QUEEN: string
}

interface ChessColors{
  WHITE: string,
  BLACK: string
}

class Terms{
  // colors
  static Colors: ChessColors = {
    WHITE: 'white',
    BLACK: 'black'
  }
  
  // types
  static Pieces: ChessPieces = {
    EMPTY : 'empty',
    PAWN: 'pawn',
    ROOK: 'rook',
    BISHOP: 'bishop',
    KNIGHT: 'knight',
    KING: 'king',
    QUEEN : 'queen',
  }

  // move types
  static Moves: ChessMoves = {
    DEFAULT: 'default',
    ILLEGAL: 'illegal',
    PROMOTION: 'promotion',
    PASSANT: 'passant',
    PAWN_DOUBLE: 'pawnDouble',
    SHORT_CASTLE: 'shortCastle',
    LONG_CASTLE: 'longCastle'
  }
}

export class Chess{
  history: Array<Array<object>>
  board: Array<object>;
  turn: number;
  passantPawn: Cordianate | null;
  constructor(){
    this.board = [
[
      new Rook(Terms.Colors.WHITE),
      new Knight(Terms.Colors.WHITE),
      new Bishop(Terms.Colors.WHITE),
      new Queen(Terms.Colors.WHITE),
      new King(Terms.Colors.WHITE),
      new Bishop(Terms.Colors.WHITE),
      new Knight(Terms.Colors.WHITE),
      new Rook(Terms.Colors.WHITE)
],
[
      new Pawn(Terms.Colors.WHITE),
      new Pawn(Terms.Colors.WHITE),
      new Pawn(Terms.Colors.WHITE),
      new Pawn(Terms.Colors.WHITE),
      new Pawn(Terms.Colors.WHITE),
      new Pawn(Terms.Colors.WHITE),
      new Pawn(Terms.Colors.WHITE),
      new Pawn(Terms.Colors.WHITE)
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
      new Pawn(Terms.Colors.BLACK),
      new Pawn(Terms.Colors.BLACK),
      new Pawn(Terms.Colors.BLACK),
      new Pawn(Terms.Colors.BLACK),
      new Pawn(Terms.Colors.BLACK),
      new Pawn(Terms.Colors.BLACK),
      new Pawn(Terms.Colors.BLACK),
      new Pawn(Terms.Colors.BLACK)
],
[
      new Rook(Terms.Colors.BLACK),
      new Knight(Terms.Colors.BLACK),
      new Bishop(Terms.Colors.BLACK),
      new Queen(Terms.Colors.BLACK),
      new King(Terms.Colors.BLACK),
      new Bishop(Terms.Colors.BLACK),
      new Knight(Terms.Colors.BLACK),
      new Rook(Terms.Colors.BLACK)
]
    ]
    this.turn = 1
    this.history = []
    this.history.push(cloneDeep(this.board))
  }

  move(x1: number, y1: number, x2:number, y2:number, promote?:string){
    const pieceType: "string" = this.board[y1][x1].type

//checks if in checkmate
    if(Chess.inCheckmate(this.board, this.turn)){
      return("Game Over! The "+Chess.getTurn(this.turn)+" king is in checkmate!")
    }

//checks if in stalamate
    if(Chess.inStalemate(this.board, this.turn)){
      return("Stalemate, "+Chess.getTurn(this.turn)+" has no legal Moves remaining, but is not in check. It's a draw!")
    }

//if piece you are trying to move isn't of the same color of current turn
    if(this.board[y1][x1].color != Chess.getTurn(this.turn)){
      return("Cannot move a "+this.board[y1][x1].color+" piece on "+Chess.getTurn(this.turn)+"'s turn.")
    }
//checks if piece can *NOT* move 
    let moveType:string = this.board[y1][x1].canMove(x1, y1, x2, y2, this.board)
    if(moveType === Terms.Moves.ILLEGAL){
      return("Cannot move piece on x: "+x1+" y: "+y1+" to x: "+x2+" y: "+y2)
    }

//check if move is outting yourself in check
    if(Chess.inCheckAfterMove(x1,y1,x2,y2,this.board,moveType,this.turn, promote)){
      return("Moving piece on x: "+x1+" y: "+y1+" to x: "+x2+" y: "+y2+" leaves king in check!")
    }

//do this if didn't return till now
    this.board = Chess.changePieceLocation(this.board, x1, y1, x2, y2, moveType, promote)
    this.turn += 1
    this.history.push(cloneDeep(this.board))
    return ("Moved "+pieceType+" from x:"+x1+" y:"+y1+" to x:"+x2+" y:"+y2)
  }

  static inCheck(board:Array<object>, turn:number):boolean{
    let myKingPos:Array<number>
    let opponentPiecesPos:Array<Array<number>> = []
    for(let i in board){
      for(let j in board[i]){
//check if piece is of the opponent's color and save its position in array
        if(board[i][j].color == Chess.getTurn(turn, true)){
          opponentPiecesPos.push([parseInt(i), parseInt(j)])
        }
//check if piece is king of the current turn's color and save its position
        if(board[i][j].type == Terms.Pieces.KING && board[i][j].color == Chess.getTurn(turn)){
          myKingPos = [parseInt(i), parseInt(j)]
        }
      }
    }

    for(let i in opponentPiecesPos){
//if piece can move to king's position, then king is in check
      if(board[opponentPiecesPos[i][0]][opponentPiecesPos[i][1]].canMove(opponentPiecesPos[i][1], opponentPiecesPos[i][0], myKingPos[1], myKingPos[0], board) !== Terms.Moves.ILLEGAL){
        console.log("The "+this.getTurn(turn)+"'s king is in check")
        return true
      }
    }
    return false
  }

  static inCheckAfterMove(x1: number, y1: number, x2:number, y2:number, board:Array<object>, moveType:string, turn:number, promote?):boolean{
//creates clone of board
    let newBoard:Array<object> = cloneDeep(board)
//Moves piece in cloned board
    newBoard = Chess.changePieceLocation(newBoard, x1, y1, x2, y2, moveType, promote)
//if move puts king on check, return true
    if(Chess.inCheck(newBoard, turn)){
      return true
    }
    return false
  }

  static changePieceLocation(board:Array<object>, x1: number, y1: number, x2:number, y2:number, moveType:string, promote?:string):Array<object>{
    if(moveType === Terms.Moves.DEFAULT){
      board[y1][x1].changeHasMoved()
      board[y2][x2] = board[y1][x1]
      board[y1][x1] = new Empty
      const enPassant = Chess.whereEnPassant(board)
      if(enPassant){
        board[enPassant.y][enPassant.x].allowPassant(false)
      }
      return board
    }
    if(moveType === Terms.Moves.SHORT_CASTLE){
      board[y1][x1].changeHasMoved()
      board[y1][7].changeHasMoved()
      board[y2][x2] = board[y1][x1]
      board[y1][x1] = new Empty
      board[y1][5] = board[y1][7]
      board[y1][7] = new Empty
      const enPassant = Chess.whereEnPassant(board)
      if(enPassant){
        board[enPassant.y][enPassant.x].allowPassant(false)
      }
      return board
    }
    if(moveType === Terms.Moves.LONG_CASTLE){
      board[y1][x1].changeHasMoved()
      board[y1][0].changeHasMoved()
      board[y2][x2] = board[y1][x1]
      board[y1][x1] = new Empty
      board[y1][3] = board[y1][0]
      board[y1][0] = new Empty
      const enPassant = Chess.whereEnPassant(board)
      if(enPassant){
        board[enPassant.y][enPassant.x].allowPassant(false)
      }
      return board
    }
    if(moveType === Terms.Moves.PAWN_DOUBLE){
      board[y1][x1].changeHasMoved()
      board[y2][x2] = board[y1][x1]
      board[y1][x1] = new Empty
      const enPassant = Chess.whereEnPassant(board)
      if(enPassant){
        board[enPassant.y][enPassant.x].allowPassant(false)
      }
      board[y2][x2].allowPassant(true)
      return board
    }

    if(moveType === Terms.Moves.PASSANT){
      board[y2][x2] = board[y1][x1]
      board[y1][x1] = new Empty
      board[y1][x2] = new Empty
      return board
    }

    if(moveType === Terms.Moves.PROMOTION){
      switch (promote) {
        case undefined:
          board[y2][x2] = new Queen(board[y1][x1].color)
          break
        case 'q':
          board[y2][x2] = new Queen(board[y1][x1].color)
          break
        case 'b':
          board[y2][x2] = new Bishop(board[y1][x1].color)
          break
        case 'n':
          board[y2][x2] = new Knight(board[y1][x1].color)
          break
        case 'r':
          board[y2][x2] = new Rook(board[y1][x1].color)
          break
        default:
          board[y2][x2] = new Queen(board[y1][x1].color)
          break
      }
      board[y1][x1] = new Empty
      const enPassant = Chess.whereEnPassant(board)
      if(enPassant){
        board[enPassant.y][enPassant.x].allowPassant(false)
      }
      return board
    }
  }

  static inCheckmate(board:Array<object>, turn:number):boolean{
//check if king is in check
    if(Chess.inCheck(board, turn)){
//two nested loops to iterate throught all pieces in board
      for(let i in board){
        for(let j in board[i]){
//if piece is of the same color of turn
          if(board[i][j].color == Chess.getTurn(turn)){
//two nested loops to iterate throught all pieces in board
            for(let k in board){
              for(let l in board[k]){
//checks if any  move can take king out of check
                let canMove = board[i][j].canMove(parseInt(j), parseInt(i), parseInt(l), parseInt(k), board)
                if(canMove !== Terms.Moves.ILLEGAL && !Chess.inCheckAfterMove(parseInt(j), parseInt(i), parseInt(l), parseInt(k), board, canMove, turn)){
                  console.log("Moving piece on x: "+j+" y: "+i+" to x: "+l+" y: "+k+" takes king out of check!")
                  return false
                }
              }
            }
          }
        }
      }
      return true
    }
    return false
  }

  static inStalemate(board:Array<object>, turn:number){
//check if king is NOT in check
    if(!Chess.inCheck(board, turn)){
//two nested loops to iterate throught all pieces in board
      for(let i in board){
        for(let j in board[i]){
          if(board[i][j].color == Chess.getTurn(turn)){
//two nested loops to iterate throught all pieces in board
            for(let k in board){
              for(let l in board[i]){
//checks if piece can move and if king is not in check after move
                let canMove = board[i][j].canMove(parseInt(j), parseInt(i), parseInt(l), parseInt(k), board)
                if(board[i][j].canMove(parseInt(j), parseInt(i), parseInt(l), parseInt(k), board) !== Terms.Moves.ILLEGAL && !Chess.inCheckAfterMove(parseInt(j), parseInt(i), parseInt(l), parseInt(k), board, canMove, turn)){
                  console.log("Moving piece on x: "+j+" y: "+i+" to x: "+l+" y: "+k+" is possible!")
                  return false
                }
              }
            }
          }
        }
      }
      return true
    }
    return false
  }

  static getTurn(turn: number, opponent: boolean = false){
    // if (turn % 2 == 1)
    if(opponent){
      turn = turn + 1
    }

    if(turn % 2){
      return Terms.Colors.WHITE
    } else {
      return Terms.Colors.BLACK
    }
  }

  static whereEnPassant(board:Array<object>):Cordianate | null{
    for(let y in board){
      for(let x in board[y]){
        if(board[y][x].canBeTakenEnPassant){
          return {x: parseInt(x), y: parseInt(y)}
        }
      }
    }
    return null
  }
}

abstract class Piece{
//declaring variables
  hasMoved: boolean
  type: string
  notation: string
  color: string
// constructor
  constructor(clr:string){
    this.color = clr
    this.hasMoved = false
  }
//abstract method
  abstract canMove(x1: number, y1: number, x2: number, y2:number, board:Array<object>):string

//set hasMoved to true 
  changeHasMoved(){
    this.hasMoved = true
  }

  allowPassant(isAllowed: boolean){
    return
  }
}

class Empty{
  type: string
  notation: string
  constructor(){
    this.type = Terms.Pieces.EMPTY
    this.notation = "."
  }
  canMove(x1: number, y1: number, x2: number, y2: number, board:Array<object>){
    return Terms.Moves.ILLEGAL
  }
}

class Pawn extends Piece{
//constructor
  canBeTakenEnPassant:boolean
  constructor(clr: string){
    super(clr)
    this.type = Terms.Pieces.PAWN
    this.notation = "p"
    this.canBeTakenEnPassant = false
  }

  allowPassant(isAllowed: boolean){
    this.canBeTakenEnPassant = isAllowed
  }

// defining canMove method
  canMove(x1: number, y1: number, x2: number, y2: number, board:Array<object>){
//for white
    if(this.color==Terms.Colors.WHITE){
//moving forward
      if(x1==x2 && board[y2][x2].type == Terms.Pieces.EMPTY){
//moving 1 forward
        if(y2==y1+1){
          if(y2 == 7){
            return Terms.Moves.PROMOTION
          }
          return Terms.Moves.DEFAULT
        }
//moving 2 forwards
        if(y1==1 && y2==3 && board[2][x2].type == Terms.Pieces.EMPTY){
          return Terms.Moves.PAWN_DOUBLE
        }
      }
//eating diagonally
      if((x2 == x1+1 || x2 == x1-1) && y2 == y1+1){
        // regular eating
        if(board[y2][x2].color != Terms.Colors.WHITE && board[y2][x2].type != Terms.Pieces.EMPTY){
          if(y2 == 7){
            return Terms.Moves.PROMOTION
          }
          return Terms.Moves.DEFAULT
        }
        // en passant
        if(board[y2][x2].type == Terms.Pieces.EMPTY && board[y1][x2].type == Terms.Pieces.PAWN && board[y1][x2].canBeTakenEnPassant && y1 == 4){
          return Terms.Moves.PASSANT
        }
      }
    }
//for black
    if(this.color==Terms.Colors.BLACK){
//moving forward
      if(x1==x2 && board[y2][x2].type == Terms.Pieces.EMPTY){
//moving 1 forward
        if(y2==y1-1){
          if(y2 == 0){
            return Terms.Moves.PROMOTION
          }
          return Terms.Moves.DEFAULT
        }
//moving 2 forward
        if(y1==6 && y2==4 && board[5][x2].type == Terms.Pieces.EMPTY){
          return Terms.Moves.PAWN_DOUBLE
        }
      }
//eating diagonally
      if((x2 == x1+1 || x2 == x1-1) && y2 == y1-1){
        // regular eating
        if(board[y2][x2].type != Terms.Pieces.EMPTY && board[y2][x2].color != Terms.Colors.BLACK){
          if(y2 == 0){
            return Terms.Moves.PROMOTION
          }
          return Terms.Moves.DEFAULT
        }
        // en passant
        if(board[y2][x2].type == Terms.Pieces.EMPTY && board[y1][x2].type == Terms.Pieces.PAWN && board[y1][x2].canBeTakenEnPassant && y1 == 3){
          return Terms.Moves.PASSANT
        }
      }
    }
    return Terms.Moves.ILLEGAL
  }
}

class Knight extends Piece{
//constructor
  constructor(clr: string){
    super(clr)
    this.type = Terms.Pieces.KNIGHT
    this.notation = "n"
  }

//defining canMove method
  canMove(x1: number, y1: number, x2: number, y2: number, board:Array<object>){
    if(board[y2][x2].type == Terms.Pieces.EMPTY || board[y2][x2].color != this.color){
    //first rectangle
      if(Math.abs(x1-x2)==2 && Math.abs(y1-y2)==1){
        return Terms.Moves.DEFAULT
      }
    //second rectangle
      if(Math.abs(y1-y2)==2 && Math.abs(x1-x2)==1){
        return Terms.Moves.DEFAULT
      }
      return Terms.Moves.ILLEGAL
    }
    return Terms.Moves.ILLEGAL
  }
}

class Rook extends Piece{
//constructor
  constructor(clr: string){
    super(clr)
    this.type = Terms.Pieces.ROOK
    this.notation = "r"
  }

// defining canMove method
  canMove(x1: number, y1: number, x2: number, y2: number, board:Array<object>){
//horizontal
    if(x1==x2){
//if positive
      if((y2-y1)>0){
//check all cases before target
        for(let i=1;i<Math.abs(y2-y1);i++){
          if(board[y1+i][x2].type!=Terms.Pieces.EMPTY){
            return Terms.Moves.ILLEGAL
          }
        }
//checks if case is empty or if there is an opponent piece
        if(board[y2][x2].type==Terms.Pieces.EMPTY || board[y2][x2].color != this.color){
          return Terms.Moves.DEFAULT
        }
      }
//if negative
      if((y2-y1)<0){
//check all cases before target
        for(let i=1;i<Math.abs(y2-y1);i++){
          if(board[y1-i][x2].type!=Terms.Pieces.EMPTY){
            return Terms.Moves.ILLEGAL
          }
        }
//checks if case is empty or if there is an opponent piece
        if(board[y2][x2].type==Terms.Pieces.EMPTY || board[y2][x2].color != this.color){
          return Terms.Moves.DEFAULT
        }
      }
    }

//vertical
    if(y1==y2){
//if positive
      if((x2-x1)>0){
//check all cases before target
        for(let i=1;i<Math.abs(x2-x1);i++){
          if(board[y2][x1+i].type!=Terms.Pieces.EMPTY){
            return Terms.Moves.ILLEGAL
          }
        }
//checks if case is empty or if there is an opponent piece
        if(board[y2][x2].type==Terms.Pieces.EMPTY || board[y2][x2].color != this.color){
          return Terms.Moves.DEFAULT
        }
      }
//if negative
      if((x2-x1)<0){
//check all cases before target
        for(let i=1;i<Math.abs(x2-x1);i++){
          if(board[y2][x1-i].type!=Terms.Pieces.EMPTY){
            return Terms.Moves.ILLEGAL
          }
        }
//checks if case is empty or if there is an opponent piece
        if(board[y2][x2].type==Terms.Pieces.EMPTY || board[y2][x2].color != this.color){
          return Terms.Moves.DEFAULT
        }
      }
    }
    return Terms.Moves.ILLEGAL
  }
}

class Bishop extends Piece{
//constructor
  constructor(clr: string){
    super(clr)
    this.type = Terms.Pieces.BISHOP
    this.notation = "b"
  }

//defining canMove method
  canMove(x1: number, y1: number, x2: number, y2: number, board:Array<object>){
    if(Math.abs(x2-x1)==Math.abs(y2-y1)){
//right side
      if((x2-x1)>0){
//up
        if((y2-y1)>0){
//check all cases before target
          for(let i=1;i<Math.abs(x2-x1);i++){
            if(board[y1+i][x1+i].type!=Terms.Pieces.EMPTY){
              return Terms.Moves.ILLEGAL
            }
          }
//checks if case is empty or if there is an opponent piece
          if(board[y2][x2].type==Terms.Pieces.EMPTY || board[y2][x2].color != this.color){
            return Terms.Moves.DEFAULT
          } 
        }
//down
        if((y2-y1)<0){
//check all cases before target
          for(let i=1;i<Math.abs(x2-x1);i++){
            if(board[y1-i][x1+i].type!=Terms.Pieces.EMPTY){
              return Terms.Moves.ILLEGAL
            }
          }
//checks if case is empty or if there is an opponent piece
          if(board[y2][x2].type==Terms.Pieces.EMPTY || board[y2][x2].color != this.color){
            return Terms.Moves.DEFAULT
          }
        }
      }


//left side
      if((x2-x1)<0){
//up
        if((y2-y1)>0){
//check all cases before target
          for(let i=1;i<Math.abs(x2-x1);i++){
            if(board[y1+i][x1-i].type!=Terms.Pieces.EMPTY){
              return Terms.Moves.ILLEGAL
            }
          }
//checks if case is empty or if there is an opponent piece
          if(board[y2][x2].type==Terms.Pieces.EMPTY || board[y2][x2].color != this.color){
            return Terms.Moves.DEFAULT
          }
        }
//down
        if((y2-y1)<0){
//check all cases before target
          for(let i=1;i<Math.abs(x2-x1);i++){
            if(board[y1-i][x1-i].type!=Terms.Pieces.EMPTY){
              return Terms.Moves.ILLEGAL
            }
          }
//checks if case is empty or if there is an opponent piece
          if(board[y2][x2].type==Terms.Pieces.EMPTY || board[y2][x2].color != this.color){
            return Terms.Moves.DEFAULT
          }
        }
      }
    }
    return Terms.Moves.ILLEGAL
  }
}

class Queen extends Piece{
  //constructor
    constructor(clr: string){
      super(clr)
      this.type = Terms.Pieces.QUEEN
      this.notation = "q"
    }
  // defining canMove method
    canMove(x1: number, y1: number, x2: number, y2: number, board:Array<object>){
      if(Math.abs(x2-x1)==Math.abs(y2-y1)){
//right side diagonal
        if((x2-x1)>0){
//up
          if((y2-y1)>0){
//check all cases before target
            for(let i=1;i<Math.abs(x2-x1);i++){
              if(board[y1+i][x1+i].type!=Terms.Pieces.EMPTY){
                return Terms.Moves.ILLEGAL
              }
            }
//checks if case is empty or if there is an opponent piece
            if(board[y2][x2].type==Terms.Pieces.EMPTY || board[y2][x2].color != this.color){
              return Terms.Moves.DEFAULT
            }
          }
//down
          if((y2-y1)<0){
//check all cases before target
            for(let i=1;i<Math.abs(x2-x1);i++){
              if(board[y1-i][x1+i].type!=Terms.Pieces.EMPTY){
                return Terms.Moves.ILLEGAL
              }
            }
//checks if case is empty or if there is an opponent piece
            if(board[y2][x2].type==Terms.Pieces.EMPTY || board[y2][x2].color != this.color){
              return Terms.Moves.DEFAULT
            }
          }
        }


//left side diagonal
        if((x2-x1)<0){
//up
          if((y2-y1)>0){
//check all cases before target
            for(let i=1;i<Math.abs(x2-x1);i++){
              if(board[y1+i][x1-i].type!=Terms.Pieces.EMPTY){
                return Terms.Moves.ILLEGAL
              }
            }
//checks if case is empty or if there is an opponent piece
            if(board[y2][x2].type==Terms.Pieces.EMPTY || board[y2][x2].color != this.color){
              return Terms.Moves.DEFAULT
            }
          }
//down
          if((y2-y1)<0){
//check all cases before target
            for(let i=1;i<Math.abs(x2-x1);i++){
              if(board[y1-i][x1-i].type!=Terms.Pieces.EMPTY){
                return Terms.Moves.ILLEGAL
              }
            }
//checks if case is empty or if there is an opponent piece
            if(board[y2][x2].type==Terms.Pieces.EMPTY || board[y2][x2].color != this.color){
              return Terms.Moves.DEFAULT
            }
          }
        }

      }
//horizontal
      if(x1==x2){
//if positive
        if((y2-y1)>0){
//check all cases before target
          for(let i=1;i<Math.abs(y2-y1);i++){
            if(board[y1+i][x2].type!=Terms.Pieces.EMPTY){
              return Terms.Moves.ILLEGAL
            }
          }
//checks if case is empty or if there is an opponent piece
          if(board[y2][x2].type==Terms.Pieces.EMPTY || board[y2][x2].color != this.color){
            return Terms.Moves.DEFAULT
          }
        }
//if negative
        if((y2-y1)<0){
//check all cases before target
          for(let i=1;i<Math.abs(y2-y1);i++){
            if(board[y1-i][x2].type!=Terms.Pieces.EMPTY){
              return Terms.Moves.ILLEGAL
            }
          }
//checks if case is empty or if there is an opponent piece
          if(board[y2][x2].type==Terms.Pieces.EMPTY || board[y2][x2].color != this.color){
            return Terms.Moves.DEFAULT
          }
        }
      }

//vertical
      if(y1==y2){
//if positive
        if((x2-x1)>0){
//check all cases before target
          for(let i=1;i<Math.abs(x2-x1);i++){
            if(board[y2][x1+i].type!=Terms.Pieces.EMPTY){
              return Terms.Moves.ILLEGAL
            }
          }
//checks if case is empty or if there is an opponent piece
          if(board[y2][x2].type==Terms.Pieces.EMPTY || board[y2][x2].color != this.color){
            return Terms.Moves.DEFAULT
          }
        }
//if negative
        if((x2-x1)<0){
//check all cases before target
          for(let i=1;i<Math.abs(x2-x1);i++){
            if(board[y2][x1-i].type!=Terms.Pieces.EMPTY){
              return Terms.Moves.ILLEGAL
            }
          }
//checks if case is empty or if there is an opponent piece
          if(board[y2][x2].type==Terms.Pieces.EMPTY || board[y2][x2].color != this.color){
            return Terms.Moves.DEFAULT
          }
        }
      }
      return Terms.Moves.ILLEGAL
    }
}

class King extends Piece{
//constructor
    constructor(clr: string){
      super(clr)
      this.type = Terms.Pieces.KING
      this.notation = "k"
      this.hasMoved = false
    }
// defining canMove method
    canMove(x1: number, y1: number, x2: number, y2: number, board:Array<object>){
      if((x2==x1+1 || x2==x1-1 || y2==y1+1 || y2==y1-1)&&(board[y2][x2].type==Terms.Pieces.EMPTY || board[y2][x2].color != this.color)&&Math.abs(x2-x1)<2&& Math.abs(y2-y1)<2){
        return Terms.Moves.DEFAULT
      }
      if(this.color === 'white'){
//check if trying to short castle
        if(y1 == 0 && x1 == 4 && y2 == 0 && x2 == 6){
//check if all cases are empty and rook there
          if(board[0][5].type==Terms.Pieces.EMPTY && board[0][6].type==Terms.Pieces.EMPTY && board[0][7].type=="rook"){
//check if any of the pieces have moved
            if(!this.hasMoved && !board[0][7].hasMoved){
              return Terms.Moves.SHORT_CASTLE
            }
          }
        }
//check if trying to long castle
      if(y1 == 0 && x1 == 4 && y2 == 0 && x2 == 2){
//check if all cases are empty and rook there
          if(board[0][3].type==Terms.Pieces.EMPTY && board[0][2].type==Terms.Pieces.EMPTY && board[0][1].type==Terms.Pieces.EMPTY && board[0][0].type=="rook"){
//check if any of the pieces have moved
            if(!this.hasMoved && !board[0][0].hasMoved){
              return Terms.Moves.LONG_CASTLE
            }
          }
        }
      }
      if(this.color === 'black'){
//check if trying to short castle
        if(y1 == 7 && x1 == 4 && y2 == 7 && x2 == 6){
//check if all cases are empty and rook there
          if(board[7][5].type==Terms.Pieces.EMPTY && board[7][6].type==Terms.Pieces.EMPTY && board[7][7].type=="rook"){
//check if any of the pieces have moved
            if(!this.hasMoved && !board[7][7].hasMoved){
              return Terms.Moves.SHORT_CASTLE
            }
          }
        }
//check if trying to long castle
      if(y1 == 7 && x1 == 4 && y2 == 7 && x2 == 2){
//check if all cases are empty and rook there
          if(board[7][3].type==Terms.Pieces.EMPTY && board[7][2].type==Terms.Pieces.EMPTY && board[7][1].type==Terms.Pieces.EMPTY && board[7][0].type=="rook"){
//check if any of the pieces have moved
            if(!this.hasMoved && !board[7][0].hasMoved){
              return Terms.Moves.LONG_CASTLE
            }
          }
        }
      }
      return Terms.Moves.ILLEGAL
    }
}