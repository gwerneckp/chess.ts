export class Chess{
  board: any;
  constructor(){
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

  getCords(){

  }
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
  canMove(x1:number, y1:number, x2:number, y2:number, board:Array<object>){
    console.log("You cannot move this piece. Position: x:",+x1+" y:",+y1)
  }
}

class Pawn extends Piece{
//declaring variables
  hasMoved: boolean
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
//declaring variables
  hasMoved: boolean
//constructor
  constructor(clr: string){
    super(clr)
    this.type = "knight"
    this.notation = "n"
  }

//0,1,2,2

// defining canMove method
  canMove(x1:number, y1:number, x2: number, y2: number, board:Array<object>){
    if(board[y2][x2].type == "empty" || board[y2][x2].color != this.color){
    //first rectangle
      if(Math.abs(x1-x2)==2){
        if(Math.abs(y1-y2)==1){
          return true
        }
      }
    //second rectangle
      if(Math.abs(y1-y2)==2){
        if(Math.abs(x1-x2)==1){
          return true
        }
      }
      return false
    }
  }
}
