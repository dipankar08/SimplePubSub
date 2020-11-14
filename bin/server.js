"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const Connection_1 = require("./Connection");
const wssConfig = {
    port: 8080
};
const wss = new ws_1.default.Server(wssConfig);
wss.on('connection', function cb(socket, req) {
    const connection = new Connection_1.Connection(socket);
    connection.handleOpen(req);
    socket.on("close", function cb(code) {
        connection.handleClose(code);
    });
    socket.on("message", function cb(data) {
        connection.handleMessage(data);
    });
});
console.log("[SimplePubSub] Server started on port 8080.");
//# sourceMappingURL=server.js.map