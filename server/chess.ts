import { cloneDeep, range } from "lodash";

export class Chess{
  board: Array<object>;
  turn: Array<string>
  constructor(){
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
    ]
    this.turn = ["white", "black"]
  }

  move(x1:number, y1:number, x2:number, y2:number){
    const pieceType: "string" = this.board[y1][x1].type

//checks if in checkmate
    if(this.inCheckmate(this.board, this.turn)){
      return("Game Over! The "+this.turn[0]+" king is in checkmate!")
    }

//checks if in stalamate
    if(this.inStalemate(this.board, this.turn)){
      return("Stalemate, "+this.turn[0]+" has no legal moves remaining, but is not in check. It's a draw!")
    }

//if piece you are trying to move isn't of the same color of current turn
    if(this.board[y1][x1].color != this.turn[0]){
      return("Cannot move a "+this.board[y1][x1].color+" piece on "+this.turn[0]+"'s turn.")
    }
//checks if piece can *NOT* move 
    if(!this.board[y1][x1].canMove(x1, y1, x2, y2, this.board)){
      return("Cannot move piece on x: "+x1+" y: "+y1+" to x: "+x2+" y: "+y2)
    }

//check if move is outting yourself in check
    if(this.inCheckAfterMove(x1,y1,x2,y2,this.board,this.turn)){
      return("Moving piece on x: "+x1+" y: "+y1+" to x: "+x2+" y: "+y2+" leaves king in check!")
    }


//do this if didn't return till now
    this.board[y2][x2] = this.board[y1][x1]
    this.board[y1][x1] = new Empty
    this.turn = [this.turn[1], this.turn[0]]
    return ("Moved "+pieceType+" from x:"+x1+" y:"+y1+" to x:"+x2+" y:"+y2)
  }

  inCheck(board:Array<object>, turn:Array<string>):boolean{
    let myKingPos:Array<number>
    let opponentPiecesPos:Array<Array<number>> = []
    for(let i in board){
      for(let j in board[i]){
//check if piece is of the opponent's color and save its position in array
        if(board[i][j].color == turn[1]){
          opponentPiecesPos.push([parseInt(i), parseInt(j)])
        }
//check if piece is king of the current turn's color and save its position
        if(board[i][j].type == "king" && board[i][j].color == turn[0]){
          myKingPos = [parseInt(i), parseInt(j)]
        }
      }
    }

    for(let i in opponentPiecesPos){
//if piece can move to king's position, then king is in check
      if(board[opponentPiecesPos[i][0]][opponentPiecesPos[i][1]].canMove(opponentPiecesPos[i][1], opponentPiecesPos[i][0], myKingPos[1], myKingPos[0], board)){
        console.log("The "+turn[0]+"'s king is in check")
        return true
      }
    }
    return false
  }

  inCheckAfterMove(x1:number, y1:number, x2:number, y2:number, board:Array<object>, turn:Array<string>):boolean{
//creates clone of board
    let newBoard:Array<object> = cloneDeep(board)
//moves piece in cloned board
    newBoard[y2][x2] = newBoard[y1][x1]
    newBoard[y1][x1] = new Empty
//if move puts king on check, return true
    if(this.inCheck(newBoard, turn)){
      return true
    }
    return false
  }

  inCheckmate(board:Array<object>, turn:Array<string>):boolean{
//check if king is in check
    if(this.inCheck(board, turn)){
//two nested loops to iterate throught all pieces in board
      for(let i in board){
        for(let j in board[i]){
//if piece is of the same color of turn
          if(board[i][j].color == turn[0]){
//two nested loops to iterate throught all pieces in board
            for(let k in board){
              for(let l in board[k]){
//checks if any  move can take king out of check
                if(board[i][j].canMove(parseInt(j), parseInt(i), parseInt(l), parseInt(k), board) && !this.inCheckAfterMove(parseInt(j), parseInt(i), parseInt(l), parseInt(k), board, turn)){
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

  inStalemate(board:Array<object>, turn:Array<string>){
//check if king is NOT in check
    if(!this.inCheck(board, turn)){
//two nested loops to iterate throught all pieces in board
      for(let i in board){
        for(let j in board[i]){
          if(board[i][j].color == turn[0]){
//two nested loops to iterate throught all pieces in board
            for(let k in board){
              for(let l in board[i]){
//checks if piece can move and if king is not in check after move
                if(board[i][j].canMove(parseInt(j), parseInt(i), parseInt(l), parseInt(k), board) && !this.inCheckAfterMove(parseInt(j), parseInt(i), parseInt(l), parseInt(k), board, turn)){
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
}

abstract class Piece{
//declaring variables
  type: string
  notation: string
  color: string
  consoleColor: string
// constructor
  constructor(clr:string){
    this.color = clr

    if(clr == "white"){
      this.consoleColor = "\x1b[37m"
    }

    if(clr == "black"){
      this.consoleColor = "\x1b[33m"
    }

  }
//abstract method
  abstract canMove(x1: number, y1: number, x2: number, y2:number, board:Array<object>):boolean
}

class Empty{
  type: string
  notation: string
  consoleColor: string
  constructor(){
    this.type = "empty"
    // this.notation = "□"
    this.notation = "."
    this.consoleColor = "\x1b[32m"
  }
  canMove(x1:number, y1:number, x2: number, y2: number, board:Array<object>){
    return false
  }
}

class Pawn extends Piece{
//constructor
  constructor(clr: string){
    super(clr)
    this.type = "pawn"
    this.notation = "p"
  }
// defining canMove method
  canMove(x1:number, y1:number, x2: number, y2: number, board:Array<object>){
//for white
    if(this.color=="white"){
//moving forward
      if(x1==x2 && board[y2][x2].type == "empty"){
//moving 1 forward
        if(y2==y1+1){
          return true
        }
//moving 2 forwards
        if(y1==1 && y2==3 && board[2][x2].type == "empty"){
          return true
        }
      }
//eating diagonally
      if((x2 == x1+1 || x2 == x1-1) && y2 == y1+1 && board[y2][x2].type != "empty"){
        if(board[y2][x2].color != "white"){
          return true
        }
      }
    }
//for black
    if(this.color=="black"){
//moving forward
      if(x1==x2 && board[y2][x2].type == "empty"){
//moving 1 forward
        if(y2==y1-1){
          return true
        }
//moving 2 forward
        if(y1==6 && y2==4 && board[5][x2].type == "empty"){
          return true
        }
      }
//eating diagonally
      if((x2 == x1+1 || x2 == x1-1) && y2 == y1-1 && board[y2][x2].type != "empty"){
        if(board[y2][x2].color != "black"){
          return true
        }
      }
    }
    return false
  }
}

class Knight extends Piece{
//constructor
  constructor(clr: string){
    super(clr)
    this.type = "knight"
    this.notation = "n"
  }

//defining canMove method
  canMove(x1:number, y1:number, x2: number, y2: number, board:Array<object>){
    if(board[y2][x2].type == "empty" || board[y2][x2].color != this.color){
    //first rectangle
      if(Math.abs(x1-x2)==2 && Math.abs(y1-y2)==1){
        return true
      }
    //second rectangle
      if(Math.abs(y1-y2)==2 && Math.abs(x1-x2)==1){
        return true
      }
      return false
    }
  }
}

class Rook extends Piece{
//constructor
  constructor(clr: string){
    super(clr)
    this.type = "rook"
    this.notation = "r"
  }

// defining canMove method
  canMove(x1:number, y1:number, x2: number, y2: number, board:Array<object>){
//horizontal
    if(x1==x2){
//if positive
      if((y2-y1)>0){
//check all cases before target
        for(let i=1;i<Math.abs(y2-y1);i++){
          if(board[y1+i][x2].type!="empty"){
            return false
          }
        }
//checks if case is empty or if there is an opponent piece
        if(board[y2][x2].type=="empty" || board[y2][x2].color != this.color){
          return true
        }
      }
//if negative
      if((y2-y1)<0){
//check all cases before target
        for(let i=1;i<Math.abs(y2-y1);i++){
          if(board[y1-i][x2].type!="empty"){
            return false
          }
        }
//checks if case is empty or if there is an opponent piece
        if(board[y2][x2].type=="empty" || board[y2][x2].color != this.color){
          return true
        }
      }
    }

//vertical
    if(y1==y2){
//if positive
      if((x2-x1)>0){
//check all cases before target
        for(let i=1;i<Math.abs(x2-x1);i++){
          if(board[y2][x1+i].type!="empty"){
            return false
          }
        }
//checks if case is empty or if there is an opponent piece
        if(board[y2][x2].type=="empty" || board[y2][x2].color != this.color){
          return true
        }
      }
//if negative
      if((x2-x1)<0){
//check all cases before target
        for(let i=1;i<Math.abs(x2-x1);i++){
          if(board[y2][x1-i].type!="empty"){
            return false
          }
        }
//checks if case is empty or if there is an opponent piece
        if(board[y2][x2].type=="empty" || board[y2][x2].color != this.color){
          return true
        }
      }
    }
    return false
  }
}

class Bishop extends Piece{
//constructor
  constructor(clr: string){
    super(clr)
    this.type = "bishop"
    this.notation = "b"
  }

//defining canMove method
  canMove(x1:number, y1:number, x2: number, y2: number, board:Array<object>){
    if(Math.abs(x2-x1)==Math.abs(y2-y1)){
//right side
      if((x2-x1)>0){
//up
        if((y2-y1)>0){
//check all cases before target
          for(let i=1;i<Math.abs(x2-x1);i++){
            if(board[y1+i][x1+i].type!="empty"){
              return false
            }
          }
//checks if case is empty or if there is an opponent piece
          if(board[y2][x2].type=="empty" || board[y2][x2].color != this.color){
            return true
          }
        }
//down
        if((y2-y1)<0){
//check all cases before target
          for(let i=1;i<Math.abs(x2-x1);i++){
            if(board[y1-i][x1+i].type!="empty"){
              return false
            }
          }
//checks if case is empty or if there is an opponent piece
          if(board[y2][x2].type=="empty" || board[y2][x2].color != this.color){
            return true
          }
        }
      }


//left side
      if((x2-x1)<0){
//up
        if((y2-y1)>0){
//check all cases before target
          for(let i=1;i<Math.abs(x2-x1);i++){
            if(board[y1+i][x1-i].type!="empty"){
              return false
            }
          }
//checks if case is empty or if there is an opponent piece
          if(board[y2][x2].type=="empty" || board[y2][x2].color != this.color){
            return true
          }
        }
//down
        if((y2-y1)<0){
//check all cases before target
          for(let i=1;i<Math.abs(x2-x1);i++){
            if(board[y1-i][x1-i].type!="empty"){
              return false
            }
          }
//checks if case is empty or if there is an opponent piece
          if(board[y2][x2].type=="empty" || board[y2][x2].color != this.color){
            return true
          }
        }
      }
    }
    return false
  }
}

class Queen extends Piece{
  //constructor
    constructor(clr: string){
      super(clr)
      this.type = "queen"
      this.notation = "q"
    }
  // defining canMove method
    canMove(x1:number, y1:number, x2: number, y2: number, board:Array<object>){
      if(Math.abs(x2-x1)==Math.abs(y2-y1)){
//right side diagonal
        if((x2-x1)>0){
//up
          if((y2-y1)>0){
//check all cases before target
            for(let i=1;i<Math.abs(x2-x1);i++){
              if(board[y1+i][x1+i].type!="empty"){
                return false
              }
            }
//checks if case is empty or if there is an opponent piece
            if(board[y2][x2].type=="empty" || board[y2][x2].color != this.color){
              return true
            }
          }
//down
          if((y2-y1)<0){
//check all cases before target
            for(let i=1;i<Math.abs(x2-x1);i++){
              if(board[y1-i][x1+i].type!="empty"){
                return false
              }
            }
//checks if case is empty or if there is an opponent piece
            if(board[y2][x2].type=="empty" || board[y2][x2].color != this.color){
              return true
            }
          }
        }


//left side diagonal
        if((x2-x1)<0){
//up
          if((y2-y1)>0){
//check all cases before target
            for(let i=1;i<Math.abs(x2-x1);i++){
              if(board[y1+i][x1-i].type!="empty"){
                return false
              }
            }
//checks if case is empty or if there is an opponent piece
            if(board[y2][x2].type=="empty" || board[y2][x2].color != this.color){
              return true
            }
          }
//down
          if((y2-y1)<0){
//check all cases before target
            for(let i=1;i<Math.abs(x2-x1);i++){
              if(board[y1-i][x1-i].type!="empty"){
                return false
              }
            }
//checks if case is empty or if there is an opponent piece
            if(board[y2][x2].type=="empty" || board[y2][x2].color != this.color){
              return true
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
            if(board[y1+i][x2].type!="empty"){
              return false
            }
          }
//checks if case is empty or if there is an opponent piece
          if(board[y2][x2].type=="empty" || board[y2][x2].color != this.color){
            return true
          }
        }
//if negative
        if((y2-y1)<0){
//check all cases before target
          for(let i=1;i<Math.abs(y2-y1);i++){
            if(board[y1-i][x2].type!="empty"){
              return false
            }
          }
//checks if case is empty or if there is an opponent piece
          if(board[y2][x2].type=="empty" || board[y2][x2].color != this.color){
            return true
          }
        }
      }

//vertical
      if(y1==y2){
//if positive
        if((x2-x1)>0){
//check all cases before target
          for(let i=1;i<Math.abs(x2-x1);i++){
            if(board[y2][x1+i].type!="empty"){
              return false
            }
          }
//checks if case is empty or if there is an opponent piece
          if(board[y2][x2].type=="empty" || board[y2][x2].color != this.color){
            return true
          }
        }
//if negative
        if((x2-x1)<0){
//check all cases before target
          for(let i=1;i<Math.abs(x2-x1);i++){
            if(board[y2][x1-i].type!="empty"){
              return false
            }
          }
//checks if case is empty or if there is an opponent piece
          if(board[y2][x2].type=="empty" || board[y2][x2].color != this.color){
            return true
          }
        }
      }
      return false
    }
}

class King extends Piece{
//constructor
    constructor(clr: string){
      super(clr)
      this.type = "king"
      this.notation = "k"
    }
// defining canMove method
    canMove(x1:number, y1:number, x2: number, y2: number, board:Array<object>){
      if((x2==x1+1 || x2==x1-1 || y2==y1+1 || y2==y1-1)&&(board[y2][x2].type=="empty" || board[y2][x2].color != this.color)&&Math.abs(x2-x1)<2&& Math.abs(y2-y1)<2){
        return true
      }
      return false
    }
}