//client.js
//@ts-ignore
var socket = io.connect('192.168.0.135:3000', { transports: ['websocket', 'polling', 'flashsocket'] }, {reconnection: true})
let sessionId:string
socket.on('connect', function(){
     sessionId = socket.id
})

function showBoardWhite(board):void{
    document.getElementById("board-gui").innerHTML = ""
    for(let i=board.length-1;i>-1;i--){
      document.getElementById("board-gui").innerHTML += "<tr data-line='"+i+"' id='l"+i+"'></tr>"
      for(let j=0;j<board[i].length;j++){
        let color:String 
        if(i % 2 == 0){
            if(j % 2 == 0){
                color = "white"
            }
            if(j % 2 != 0){
                color = "black"
            }
        }
        if(i % 2 != 0){
            if(j % 2 != 0){
                color = "white"
            }
            if(j % 2 == 0){
                color = "black"
            }
        }
        document.getElementById("l"+i).innerHTML += "<td class='square "+color+"' data-x="+j+" data-y="+i+" id='l"+i+"p"+j+"'></td>"
        document.getElementById("l"+i+"p"+j+"").innerHTML += "<img src='./assets/pieces/"+board[i][j].color+"_"+board[i][j].type+".svg' style='width:100px; height: 100px;'></img>"
      }
    }
}

function showBoardBlack(board):void{
    document.getElementById("board-gui").innerHTML = ""
    for(let i=0;i<board.length;i++){
      document.getElementById("board-gui").innerHTML += "<tr data-line='"+i+"' id='l"+i+"'></tr>"
      for(let j = board[i].length-1; j>-1; j--){
        let color:String 
        if(i % 2 == 0){
            if(j % 2 == 0){
                color = "white"
            }
            if(j % 2 != 0){
                color = "black"
            }
        }
        if(i % 2 != 0){
            if(j % 2 != 0){
                color = "white"
            }
            if(j % 2 == 0){
                color = "black"
            }
        }
        document.getElementById("l"+i).innerHTML += "<td class='square "+color+"' data-x="+j+" data-y="+i+" id='l"+i+"p"+j+"'></td>"
        document.getElementById("l"+i+"p"+j+"").innerHTML += "<img src='./assets/pieces/"+board[i][j].color+"_"+board[i][j].type+".svg' style='width:100px; height: 100px;'></img>"
      }
    }
}

function getClickListenerReady(board, role):void{
    let selectedSquareId:string = ''
    let squareList:object = document.getElementsByClassName("square")
    for(let i in squareList){
        let square = squareList[i]
        if(typeof(square) != "object"){
            continue
        }
        document.getElementById(square.id).addEventListener("click", function(){
            if(selectedSquareId == '' && board[square.dataset.y][square.dataset.x].type=="empty"){
                return
            }
            if(selectedSquareId == '' && role != board[square.dataset.y][square.dataset.x].color){
                return
            }
            if(selectedSquareId != ''){
                let squareFrom = document.getElementById(selectedSquareId)
                console.log(squareFrom.dataset.x, squareFrom.dataset.y, square.dataset.x, square.dataset.y)
                socket.emit("game", squareFrom.dataset.x, squareFrom.dataset.y, square.dataset.x, square.dataset.y)
                return
            }
            selectedSquareId = square.id
            square.style.backgroundColor = "rgb(158, 152, 137)"
            console.log(square.dataset.x, square.dataset.y)
        })
    }
}

function showBoard(players, chess):void{
    if(sessionId == players.whitePlayer){
        showBoardWhite(chess.board)
        return 
    }
    if(sessionId == players.blackPlayer){
        showBoardBlack(chess.board)
        return 
    }
    if(chess.turn[0] == "white"){
        showBoardWhite(chess.board)
        return
    }
    if(chess.turn[0] == "black"){
        showBoardBlack(chess.board)
        return
    }
}

function showRole(players, chess):string{
    let roleDiv:string = document.getElementById("role").innerHTML
    if(sessionId == players.whitePlayer){
        if(chess.turn[0] == "white"){
            document.getElementById("role").innerHTML = "<h1 style='color: ffffff;'>Your turn!"
            return "white"
        }
        if(chess.turn[0] == "black"){
            document.getElementById("role").innerHTML = "<h1 style='color: 000000;'>Opponent's turn. Wait!"
            return "white"
        }
    }

    if(sessionId == players.blackPlayer){
        if(chess.turn[0] == "white"){
            document.getElementById("role").innerHTML = "<h1 style='color: 000000;'>Opponent's turn. Wait!"
            return "black"
        }
        if(chess.turn[0] == "black"){
            document.getElementById("role").innerHTML = "<h1 style='color: ffffff;'>Your turn!"
            return "black"
        }
    }

    for(let i in players.spectator){
        if(sessionId == players.spectator[i]){
            document.getElementById("role").innerHTML = "<h1 style='color: ffffff;'>Spectating"
            return "spectator"

        }
    }
}

socket.on("game", function (players, chess) {
    showBoard(players, chess)
    let role = showRole(players, chess)
    getClickListenerReady(chess.board, role)
});