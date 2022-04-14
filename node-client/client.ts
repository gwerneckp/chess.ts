//client.js
import { io, Socket } from "socket.io-client";

//user input
import promptSync from 'prompt-sync';
const prompt = promptSync();

// @ts-ignore 
var socket = io.connect('http://localhost:3000', {reconnection: true});

//defining showboard function
function showBoard(board):string{
    const letters:Array<string> = ["a","b","c","d","e","f","g","h"]
    let boardPrint:string = ""
    for(let i=board.length-1;i>-1;i--){
  
      let line:string = ""
  
      boardPrint += ""+(i+1)+" "
      boardPrint += "  "
  
      for(let j=0;j<board[i].length;j++){
        line += board[i][j].consoleColor+board[i][j].notation+'\x1b[0m'
        line += " "
      }
      boardPrint += line
      boardPrint += "\n"
  
    }
  
    boardPrint += "\n"
    boardPrint += "    "
    for(let k=0;k<8;k++){
      boardPrint += letters[k]
      boardPrint += " "
    }
    return boardPrint
  }

// Add a connect listener
socket.on('connect', function (socket: Socket) {
    console.log('Connected!');
});

function showTurn(turn):string{
  let turnColor:string
  if(turn[0]=="white"){
    turnColor = "\x1b[37m"
  }
  if(turn[0]=="black"){
    turnColor = "\x1b[33m"
  }
  return (turnColor+turn[0]+"'s turn"+"\x1b[0m")
}

function letterToNumber(ltr):number{
  const letters = {"a":0,"b":1,"c":2,"d":3,"e":4,"f":5,"g":6,"h":7}
  return letters[ltr]
}

function notationToNumbers(moveStr):Array<number>{
  let moveArr:Array<number> = []
  let arr:Array<any> = moveStr.split(" ")
  moveArr[0] = letterToNumber(arr[0][0])
  moveArr[1] = parseInt(arr[0][1])-1
  moveArr[2] = letterToNumber(arr[1][0])
  moveArr[3] = parseInt(arr[1][1])-1
  return moveArr
}

socket.on("game", function (chess) {
    let move:Array<number>
    console.log("\n")
    console.log(showBoard(chess.board))
    console.log("\n")
    console.log(showTurn(chess.turn))
    const moveStr:string = prompt("next move: ")
    move = notationToNumbers(moveStr)
    socket.emit("game", move[0], move[1], move[2], move[3])
});