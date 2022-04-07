import {Chess} from './chess';

const game = new Chess

function showBoard(){
  let board:string = ""
  for(let i=game.board.length-1;i>-1;i--){

    let line:string = ""

    board += ""+i+" "
    board += "  "

    for(let j=0;j<game.board[i].length;j++){
      line += game.board[i][j].consoleColor+game.board[i][j].notation+'\x1b[0m'
      line += " "
    }
    board += line
    board += "\n"

  }

  board += "\n"
  board += "    "
  for(let k=0;k<8;k++){
    board += k
    board += " "
  }


  console.log(board)
}

 showBoard()
 console.log(game.board[1][1].color)
 game.move(3,1,3,3)
 showBoard()
