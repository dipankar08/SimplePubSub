"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultTopicConfig = {
    name: "",
    limit: 100,
    isBroadCastSupported: true,
    isLookBack: true,
    TTL: 5 * 60,
    isDebug: false,
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
        if (json.isDebug) {
            config.isDebug = json.isDebug;
        }
        if (json.isLookBack) {
            config.isLookBack = json.isLookBack;
        }
        return json;
    }
}
exports.topicConfigManager = new TopicConfigManager();
//# sourceMappingURL=TopicsConfigManager.js.map