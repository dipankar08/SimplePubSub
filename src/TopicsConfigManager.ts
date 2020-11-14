
export type TopicConfig ={
    name:string,
    limit:number,
    isBroadCastSupported:boolean,
    isLookBack:boolean,
    authorInfo?:any,
    TTL:number // second
    isDebug:boolean // true to get stack
}

export const defaultTopicConfig: TopicConfig = {
    name:"",
    limit:100,
    isBroadCastSupported:true,
    isLookBack:true,
    TTL:5*60,
    isDebug:false,
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
        if(json.isDebug){
            config.isDebug = json.isDebug;
        }
        if(json.isLookBack){
            config.isLookBack = json.isLookBack;
        }
        return json;
    }
}
export const topicConfigManager = new TopicConfigManager();
