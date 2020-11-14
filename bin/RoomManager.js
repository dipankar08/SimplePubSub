"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TopicManager {
    constructor() {
        this.topicMaps = new Map();
        this.connMaps = new Map();
    }
    addConnection(topic, conn) {
        if (!this.topicMaps.has(topic)) {
            this.topicMaps.set(topic, new Set());
            this.connMaps;
        }
        this.topicMaps.get(topic).add(conn);
        this.connMaps.set(conn, topic);
    }
    removeConnection(conn) {
        let topic = this.connMaps.get(conn);
        if (topic) {
            this.topicMaps.get(topic).delete(conn);
        }
    }
    getPeers(conn) {
        let topic = this.connMaps.get(conn);
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