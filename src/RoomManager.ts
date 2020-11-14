import { Connection } from "./Connection";

class TopicManager {
    greeting: string;
    topicMaps : Map<string, Set<Connection>>
    connMaps:Map<Connection, string>;
    constructor() {
      this.topicMaps = new Map();
      this.connMaps = new Map()
    }

    addConnection(topic:string, conn:Connection){
      if(!this.topicMaps.has(topic)){
        this.topicMaps.set(topic, new Set());
        this.connMaps
      }
      this.topicMaps.get(topic).add(conn);
      this.connMaps.set(conn, topic);
    }

    removeConnection(conn:Connection){
      let topic = this.connMaps.get(conn);
      if(topic){
        this.topicMaps.get(topic).delete(conn);
      }
    }

    getPeers(conn:Connection): Connection[]{
      let topic = this.connMaps.get(conn);
      if(!topic){
        return [];
      }
      let all = this.topicMaps.get(topic);
      if(!all){
        return [];
      }
      return Array.from(all);
    }
}
export const topicManager = new TopicManager()