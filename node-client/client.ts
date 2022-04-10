//client.js
import { io, Socket } from "socket.io-client";

var socket = io.connect('http://localhost:3000', {reconnect: true});

function showBoard(board){
    let boardPrint:string = ""
    for(let i=board.length-1;i>-1;i--){
  
      let line:string = ""
  
      boardPrint += ""+i+" "
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
      boardPrint += k
      boardPrint += " "
    }
  
  
    console.log(boardPrint)
    console.log("\n")
  }

// Add a connect listener
socket.on('connect', function (socket: Socket) {
    console.log('Connected!');
});

socket.on("game", function (arg) {
    showBoard(arg);
});