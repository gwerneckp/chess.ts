//socket.io and http modules
import { createServer } from "http";
import { Server, Socket } from "socket.io";

//importing chess game
import {Chess} from './chess';
const game = new Chess

//creating http server
const httpServer = createServer();
const io = new Server(httpServer);

//emit game board on connection
io.on("connection", function (socket: Socket) {
    io.emit("game", game.board)
    socket.on("game", function(x1,y1,x2,y2){
        console.log(game.move(x1,y1,x2,y2))
        io.emit("game", game.board)
    })
});

//create http server on port 3000    
httpServer.listen(3000);