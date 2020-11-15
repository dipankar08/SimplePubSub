import { Connection } from "./Connection";

class TopicManager {
    // This is bi-detcetinal map for quick loopup.
    topicMaps : Map<string, Set<Connection>> // for a topic which conntion are associted.
    connMaps:Map<Connection, Set<string>>; // for a comnnectin which topics they subsriobed
    constructor() {
      this.topicMaps = new Map();
      this.connMaps = new Map()
    }

    addConnection(topic:string, conn:Connection){
      if( this.topicMaps.get(topic) && this.topicMaps.get(topic).has(conn)){
        throw Error("already subscribed");
      }
      if(!this.topicMaps.has(topic)){
        this.topicMaps.set(topic, new Set());
      }
      this.topicMaps.get(topic).add(conn);
      if(!this.connMaps.has(conn)){
        this.connMaps.set(conn, new Set());
      }
      this.connMaps.get(conn).add(topic);
    }

    removeConnection(topic:string, conn:Connection){
      if(!this.connMaps.has(conn)){
        throw Error("already unsubscribed");
      }
      this.topicMaps.get(topic).delete(conn);
      this.connMaps.get(conn).delete(topic);

      // clean up DS empty.
    }
    getPeers(topic:string): Connection[]{
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