export class Chess{
  board: any;
  constructor(){
    this.board = [
[
      new Rook("white"),
      new Knight("white"),
      new Pawn("white"),
      new Pawn("white"),
      new King("white"),
      new Pawn("white"),
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
      new Pawn("black"),
      new Pawn("black"),
      new King("black"),
      new Pawn("black"),
      new Knight("black"),
      new Rook("black")
]
    ]
  }

  move(x1:number, y1:number, x2:number, y2:number){
    if(this.board[y1][x1].canMove(x1, y1, x2, y2, this.board)){
      this.board[y2][x2] = this.board[y1][x1]
      this.board[y1][x1] = new Empty
    }
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
  canMove(x1:number, y1:number){
    console.log("You cannot move this piece. Position: x:",+x1+" y:",+y1)
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
//moving 2 forward
        if(y1==1 && y2==3){
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
        if(y1==6 && y2==4){
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
          console.log(i)
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

//0,4,7,4
//vertical
    if(y1==y2){
//if positive
      if((x2-x1)>0){
//check all cases before target
        for(let i=1;i<Math.abs(x2-x1);i++){
          console.log(i)
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
      if((x2==x1+1 || x2==x1-1 || y2==y1+1 || y2==y1-1)&&(board[y2][x2].type=="empty" || board[y2][x2].color != this.color)){
        return true
      }
      return false
    }
}
