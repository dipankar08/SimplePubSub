"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultTopicConfig = {
    topic: "",
    limit: 100,
    isBroadCastSupported: true,
    isLookBack: true,
    TTL: 5 * 60,
    debug: false,
    username: "guest",
};
class TopicConfigManager {
    constructor() {
        this.map = new Map();
    }
    getTopicConfig(topic) {
        if (this.map.has(topic)) {
            return this.map.get(topic);
        }
        else {
            return exports.defaultTopicConfig;
        }
    }
    buildConfig(topic, json) {
        var config = exports.defaultTopicConfig;
        if (json.topic) {
            config.topic = json.topic;
        }
        if (json.debug) {
            config.debug = json.debug;
        }
        if (json.isLookBack) {
            config.isLookBack = json.isLookBack;
        }
        if (json.username) {
            config.username = json.username;
        }
        return json;
    }
}
exports.topicConfigManager = new TopicConfigManager();
//# sourceMappingURL=TopicsConfigManager.js.map