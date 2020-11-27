import { IncomingMessage } from "http";
import WebSocket from "ws"
import { Connection } from "./Connection";

const wssConfig ={
  port: process.env.vs_debug == "true"? 8080:7777
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
console.log(`[SimplePubSub] Server started on port ${wssConfig.port}` )