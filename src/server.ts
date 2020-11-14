import { IncomingMessage } from "http";
import WebSocket from "ws"
import { Connection } from "./Connection";

const wssConfig ={
 port: 8080
}

const wss = new WebSocket.Server(wssConfig);
wss.on('connection', function cb(socket:WebSocket, req:IncomingMessage){
    const connection:Connection =  new Connection(socket);
    connection.handleOpen(req);
    socket.on("close", function cb(code){
        connection.handleClose(code);
    })
    socket.on("message", function cb(data){
        connection.handleMessage(data);
    });
})
console.log("[SimplePubSub] Server started on port 8080.")