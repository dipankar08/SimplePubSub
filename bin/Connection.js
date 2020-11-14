"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const Assert_1 = require("./Assert");
const dlog_1 = require("./dlog");
const RoomManager_1 = require("./RoomManager");
const TopicsConfigManager_1 = require("./TopicsConfigManager");
class Connection {
    constructor(webSocket) {
        this.mUsername = "Guest User";
        dlog_1.dlog.trace();
        this.ws = webSocket;
        this.mTopicConfig = TopicsConfigManager_1.defaultTopicConfig;
        this.mTopic = "";
    }
    handleOpen(req) {
        dlog_1.dlog.trace();
        // DO Nothing until they subscibe
    }
    handleClose(code) {
        dlog_1.dlog.trace();
        try {
            this.propagateMessage(`${this.mUsername} leaved`);
            RoomManager_1.topicManager.removeConnection(this);
        }
        catch (e) {
        }
    }
    handleMessage(data) {
        dlog_1.dlog.trace();
        try {
            var msg = JSON.parse(data);
            this.handleJsonData(msg);
        }
        catch (err) {
            this.handleBinaryData(data);
        }
    }
    handleJsonData(json) {
        dlog_1.dlog.trace();
        switch (json.type) {
            case 'subscribe':
                dlog_1.dlog.trace();
                try {
                    Assert_1.verifyOrThrow(json.topic, "Please send the topic");
                    RoomManager_1.topicManager.addConnection(json.topic, this);
                    this.mTopicConfig = TopicsConfigManager_1.topicConfigManager.buildConfig(json.topic, json);
                    this.propagateMessage(`${this.mUsername} joined`);
                }
                catch (err) {
                    this.sendError("subscribe_ack", err.message);
                }
                break;
            case 'unsubscribe':
                dlog_1.dlog.trace();
                try {
                    this.handleClose(0);
                }
                catch (err) {
                    this.sendError("unsubscribe_ack", err.message);
                }
                break;
            case "message":
                dlog_1.dlog.trace();
                try {
                    this.propagateMessage(json.message);
                }
                catch (err) {
                    this.sendError("message_ack", err.message);
                }
                break;
            default:
                dlog_1.dlog.trace();
                this.sendError("unsubscribe_ack", `You must send a message with topic subscribe | unsubscribe | message`);
        }
    }
    handleBinaryData(data) {
        this.sendError("unknown", "Binary Data is not supported");
    }
    isOpen() {
        return this.ws.readyState == ws_1.OPEN;
    }
    sendError(topic, msg) {
        dlog_1.dlog.trace();
        if (this.mTopicConfig.isDebug) {
            this.ws.send(JSON.stringify({ 'topic': topic, 'data': msg, 'status': 'error', 'stack': new Error().stack }));
        }
        else {
            this.ws.send(JSON.stringify({ 'topic': topic, 'data': msg, 'status': 'error' }));
        }
    }
    sendMessage(topic, msg) {
        dlog_1.dlog.trace();
        this.ws.send(JSON.stringify({ 'topic': topic, 'data': msg }));
    }
    propagateMessage(message) {
        dlog_1.dlog.trace();
        Assert_1.verifyOrThrow(message, "the message is null or undefined");
        let peers = RoomManager_1.topicManager.getPeers(this);
        Assert_1.verifyOrThrow(peers.length > 0, "No one listening to this topic");
        peers.forEach(function (peerConn) {
            if (peerConn == this && !this.mTopicConfig.isLookBack) {
                // TODO:
            }
            if (peerConn.isOpen()) {
                peerConn.sendMessage("message", message);
            }
        });
    }
}
exports.Connection = Connection;
//# sourceMappingURL=Connection.js.map