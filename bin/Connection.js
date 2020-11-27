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
                this.handleUnsubscribe({ topic: topic });
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
                    this.handleSubscribe(json);
                    this.sendPeers("subscribe_ack", topic, `${this.mTopicConfigMap.get(topic).username} subscribed ${topic}`);
                }
                catch (err) {
                    dlog_1.dlog.err(err);
                    this.sendError(topic, "subscribe_ack", err.message);
                }
                break;
            case 'unsubscribe':
                dlog_1.dlog.trace();
                try {
                    this.handleUnSubscribe(json);
                }
                catch (err) {
                    dlog_1.dlog.err(err);
                    this.sendError(topic, "unsubscribe_ack", err.message);
                }
                break;
            case "message":
                dlog_1.dlog.trace();
                try {
                    this.sendJsonToPeers(json);
                    this.sendSelf("message_ack", `message sent to topic: ${topic}`);
                }
                catch (err) {
                    dlog_1.dlog.err(err);
                    this.sendError(topic, "message_ack", err.message);
                }
                break;
            case "reset":
                dlog_1.dlog.trace();
                try {
                    this.sendSelf("reset_ack", "reset done --- TODO --");
                }
                catch (err) {
                    dlog_1.dlog.err(err);
                    this.sendError(topic, "reset_ack", err.message);
                }
                break;
            case "status":
                dlog_1.dlog.trace();
                try {
                    this.sendSelf("status_ack", "status is: -- TODO --");
                }
                catch (err) {
                    dlog_1.dlog.err(err);
                    this.sendError(topic, "status_ack", err.message);
                }
                break;
            default:
                dlog_1.dlog.trace();
                this.sendError(topic, "unsubscribe_ack", `You must send a message with topic subscribe | unsubscribe | message`);
        }
    }
    handleSubscribe(json) {
        Assert_1.verifyOrThrow(json.topic, "Please send the topic");
        RoomManager_1.topicManager.addConnection(json.topic, this);
        this.mTopicConfigMap.set(json.topic, TopicsConfigManager_1.topicConfigManager.buildConfig(json.topic, json));
    }
    handleUnSubscribe(json) {
        Assert_1.verifyOrThrow(json.topic, "Please send the topic");
        if (!this.mTopicConfigMap.has(json.topic)) {
            throw Error(`already unsubscribed ${json.topic}`);
        }
        let username = this.mTopicConfigMap.get(json.topic).username;
        this.sendPeers("unsubscribe_ack", json.topic, `${username} unsubscribed ${json.topic}`);
        RoomManager_1.topicManager.removeConnection(json.topic, this);
        this.mTopicConfigMap.delete(json.topic);
    }
    handleBinaryData(data) {
        this.sendError("default", "unknown", `Binary Data is not supported yet, Please send a string encoded JSON:${data}`);
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
            this.ws.send(JSON.stringify({ 'type': type, 'data': msg, 'status': 'error' }));
        }
    }
    sendSelf(type, msg) {
        dlog_1.dlog.trace();
        this.ws.send(JSON.stringify({ 'type': type, 'message': msg }));
    }
    selfSendJson(json) {
        dlog_1.dlog.trace();
        this.ws.send(JSON.stringify(json));
    }
    sendPeers(type, topic, message) {
        dlog_1.dlog.trace();
        Assert_1.verifyOrThrow(message, "the message is null or undefined");
        let peers = RoomManager_1.topicManager.getPeers(topic);
        Assert_1.verifyOrThrow(peers.length > 0, "No one listening to this topic");
        peers.forEach(function (peerConn) {
            if (peerConn == this && !this.mTopicConfig.isLookBack) {
                // TODO:
            }
            if (peerConn.isOpen()) {
                peerConn.selfSendJson({ type: type, topic: topic, message: message });
            }
        });
    }
    sendJsonToPeers(json) {
        dlog_1.dlog.trace();
        Assert_1.verifyOrThrow(json.topic, "Please send the intended topic");
        Assert_1.verifyOrThrow(json.message, "the message is null or undefined");
        Assert_1.verifyOrThrow(this.mTopicConfigMap.has(json.topic), "You must subscribe the topic first");
        let peers = RoomManager_1.topicManager.getPeers(json.topic);
        Assert_1.verifyOrThrow(peers.length > 0, "No one listening to this topic");
        peers.forEach(function (peerConn) {
            if (peerConn == this && !this.mTopicConfig.isLookBack) {
                // TODO:
            }
            if (peerConn.isOpen()) {
                peerConn.selfSendJson(json);
            }
        });
    }
}
exports.Connection = Connection;
//# sourceMappingURL=Connection.js.map