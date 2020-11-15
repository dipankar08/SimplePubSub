"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const Assert_1 = require("./Assert");
const dlog_1 = require("./dlog");
const RoomManager_1 = require("./RoomManager");
const TopicsConfigManager_1 = require("./TopicsConfigManager");
class Connection {
    constructor(webSocket) {
        dlog_1.dlog.trace();
        this.ws = webSocket;
        this.mTopicConfigMap = new Map();
    }
    handleOpen(req) {
        dlog_1.dlog.trace();
        // We should not have a default one just to redunce the spamming
        // this.mTopicConfigMap.set("default", defaultTopicConfig);
    }
    handleClose(code) {
        dlog_1.dlog.trace();
        try {
            this.mTopicConfigMap.forEach(function (v, topic) {
                this.removeTopic(topic);
            });
        }
        catch (e) {
            dlog_1.dlog.err(e);
        }
    }
    handleMessage(data) {
        dlog_1.dlog.trace();
        try {
            var msg = JSON.parse(data);
            this.handleJsonData(msg);
        }
        catch (err) {
            dlog_1.dlog.err(err);
            this.handleBinaryData(data);
        }
    }
    handleJsonData(json) {
        dlog_1.dlog.trace();
        let topic = json.topic || "default";
        switch (json.type) {
            case 'subscribe':
                dlog_1.dlog.trace();
                try {
                    Assert_1.verifyOrThrow(json.topic, "Please send the topic");
                    RoomManager_1.topicManager.addConnection(topic, this);
                    this.mTopicConfigMap.set(topic, TopicsConfigManager_1.topicConfigManager.buildConfig(topic, json));
                    this.propagateMessage(topic, `${this.mTopicConfigMap.get(topic).username} subscribed ${this.mTopicConfigMap.get(topic).topic}`);
                }
                catch (err) {
                    dlog_1.dlog.err(err);
                    this.sendError(topic, "subscribe_ack", err.message);
                }
                break;
            case 'unsubscribe':
                dlog_1.dlog.trace();
                try {
                    Assert_1.verifyOrThrow(json.topic, "Please send the topic");
                    this.removeTopic(json.topic);
                }
                catch (err) {
                    dlog_1.dlog.err(err);
                    this.sendError(topic, "unsubscribe_ack", err.message);
                }
                break;
            case "message":
                dlog_1.dlog.trace();
                try {
                    this.propagateMessage(topic, json.message);
                }
                catch (err) {
                    dlog_1.dlog.err(err);
                    this.sendError(topic, "message_ack", err.message);
                }
                break;
            default:
                dlog_1.dlog.trace();
                this.sendError(topic, "unsubscribe_ack", `You must send a message with topic subscribe | unsubscribe | message`);
        }
    }
    removeTopic(topic) {
        if (!this.mTopicConfigMap.has(topic)) {
            throw Error(`already unsubscribed ${topic}`);
        }
        this.propagateMessage(topic, `${this.mTopicConfigMap.get(topic).username} unsubscribed ${this.mTopicConfigMap.get(topic).topic}`);
        RoomManager_1.topicManager.removeConnection(topic, this);
        this.mTopicConfigMap.delete(topic);
    }
    handleBinaryData(data) {
        this.sendError("default", "unknown", "Binary Data is not supported");
    }
    isOpen() {
        return this.ws.readyState == ws_1.OPEN;
    }
    sendError(topic, type, msg) {
        dlog_1.dlog.trace();
        if (this.mTopicConfigMap.get(topic) && this.mTopicConfigMap.get(topic).debug) {
            this.ws.send(JSON.stringify({ 'type': type, 'data': msg, 'status': 'error', 'stack': new Error().stack }));
        }
        else {
            this.ws.send(JSON.stringify({ 'type': type, 'data': msg, 'status': 'error', 'stack': new Error().stack }));
        }
    }
    sendMessage(type, msg) {
        dlog_1.dlog.trace();
        this.ws.send(JSON.stringify({ 'type': type, 'data': msg }));
    }
    propagateMessage(topic, message) {
        dlog_1.dlog.trace();
        Assert_1.verifyOrThrow(message, "the message is null or undefined");
        let peers = RoomManager_1.topicManager.getPeers(topic);
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