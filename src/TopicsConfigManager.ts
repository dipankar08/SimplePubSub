
export type TopicConfig ={
    topic:string,// topic name
    limit:number,
    isBroadCastSupported:boolean,
    isLookBack:boolean,
    authorInfo?:any,
    TTL:number // second
    debug:boolean // true to get stack
    username:string,
}

export const defaultTopicConfig: TopicConfig = {
    topic:"",
    limit:100,
    isBroadCastSupported:true,
    isLookBack:true,
    TTL:5*60,
    debug:false,
    username:"guest",
}

class TopicConfigManager {
    
    greeting: string;
    map:Map<string, TopicConfig>;
    constructor() {
        this.map = new Map();
    }
    getTopicConfig(topic:string):TopicConfig{
        if(this.map.has(topic)){
            return this.map.get(topic);
        } else {
            return defaultTopicConfig;
        }
    }

    buildConfig(topic: any, json: any): TopicConfig {
        var config = defaultTopicConfig;
        if(json.topic){
            config.topic = json.topic;
        }
        if(json.debug){
            config.debug = json.debug;
        }
        if(json.isLookBack){
            config.isLookBack = json.isLookBack;
        }
        if(json.username){
            config.username = json.username;
        }
        return json;
    }
}
export const topicConfigManager = new TopicConfigManager();
