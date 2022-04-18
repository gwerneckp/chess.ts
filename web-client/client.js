//client.js
//@ts-ignore
var socket = io.connect('localhost:3000', { transports: ['websocket', 'polling', 'flashsocket'] }, { reconnection: true });
function showBoard(board) {
    const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
    document.getElementById("board-gui").innerHTML = "";
    for (let i = board.length - 1; i > -1; i--) {
        document.getElementById("board-gui").innerHTML += "<tr data-line='" + i + "' id='l" + i + "'></tr>";
        for (let j = 0; j < board[i].length; j++) {
            document.getElementById("l" + i).innerHTML += "<td class='square' data-x=" + j + " data-y=" + i + " id='l" + i + "p" + j + "'></td>";
            document.getElementById("l" + i + "p" + j + "").innerHTML += "<img class='drag-drop' src='./assets/pieces/" + board[i][j].color + "_" + board[i][j].type + ".svg' style='width:100px; height: 100px;'></img>";
        }
    }
}
function getClickListenerReady(board) {
    let selectedSquareId = '';
    let squareList = document.getElementsByClassName("square");
    for (let i in squareList) {
        let square = squareList[i];
        if (typeof (square) != "object") {
            continue;
        }
        document.getElementById(square.id).addEventListener("click", function () {
            if (selectedSquareId == '' && board[square.dataset.y][square.dataset.x].type == "empty") {
                return;
            }
            if (selectedSquareId != '') {
                let squareFrom = document.getElementById(selectedSquareId);
                console.log(squareFrom.dataset.x, squareFrom.dataset.y, square.dataset.x, square.dataset.y);
                socket.emit("game", squareFrom.dataset.x, squareFrom.dataset.y, square.dataset.x, square.dataset.y);
                return;
            }
            selectedSquareId = square.id;
            console.log(square.dataset.x, square.dataset.y);
        });
    }
}
socket.on("game", function (chess) {
    let move;
    console.log(chess);
    showBoard(chess.board);
    getClickListenerReady(chess.board);
});
