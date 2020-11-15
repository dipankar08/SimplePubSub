"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TopicManager {
    constructor() {
        this.topicMaps = new Map();
        this.connMaps = new Map();
    }
    addConnection(topic, conn) {
        if (this.topicMaps.get(topic) && this.topicMaps.get(topic).has(conn)) {
            throw Error("already subscribed");
        }
        if (!this.topicMaps.has(topic)) {
            this.topicMaps.set(topic, new Set());
        }
        this.topicMaps.get(topic).add(conn);
        if (!this.connMaps.has(conn)) {
            this.connMaps.set(conn, new Set());
        }
        this.connMaps.get(conn).add(topic);
    }
    removeConnection(topic, conn) {
        if (!this.connMaps.has(conn)) {
            throw Error("already unsubscribed");
        }
        this.topicMaps.get(topic).delete(conn);
        this.connMaps.get(conn).delete(topic);
        // clean up DS empty.
    }
    getPeers(topic) {
        if (!topic) {
            return [];
        }
        let all = this.topicMaps.get(topic);
        if (!all) {
            return [];
        }
        return Array.from(all);
    }
}
exports.topicManager = new TopicManager();
//# sourceMappingURL=RoomManager.js.map