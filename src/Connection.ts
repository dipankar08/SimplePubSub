
import { IncomingMessage } from "http";
import WebSocket, { OPEN } from "ws"
import { verifyOrThrow } from "./Assert";
import { dlog } from "./dlog";
import { topicManager } from "./RoomManager";
import { defaultTopicConfig, TopicConfig, topicConfigManager } from "./TopicsConfigManager";

export class Connection {
    ws: WebSocket;
    mTopicConfigMap: Map<string, TopicConfig>; // this is a map
    constructor(webSocket: WebSocket) {
      dlog.trace();
      this.ws = webSocket;
      this.mTopicConfigMap = new Map();
    }
    
    handleOpen(req: IncomingMessage) {
        dlog.trace();
        // We should not have a default one just to redunce the spamming
        // this.mTopicConfigMap.set("default", defaultTopicConfig);
    }

    handleClose(code: number) {
        dlog.trace();
        try{
            this.mTopicConfigMap.forEach(function(v, topic){
                this.removeTopic(topic);
            })
        } catch(e){
            dlog.err(e)
        }
    }


    handleMessage(data:any){
        dlog.trace();
        try{
            var msg = JSON.parse(data);
            this.handleJsonData(msg);
        } catch(err){
            dlog.err(err)
            this.handleBinaryData(data);
        }
    }

    private handleJsonData(json:any){
        dlog.trace();
        let topic = json.topic || "default";
            switch(json.type) {
                case 'subscribe':
                    dlog.trace();
                    try{
                        verifyOrThrow(json.topic,"Please send the topic");
                        topicManager.addConnection(topic, this);
                        this.mTopicConfigMap.set(topic, topicConfigManager.buildConfig(topic,json));
                        this.propagateMessage(topic, `${this.mTopicConfigMap.get(topic).username} subscribed ${this.mTopicConfigMap.get(topic).topic}`)
                    } catch(err){
                        dlog.err(err)
                        this.sendError(topic, "subscribe_ack", err.message)
                    }
                    break;
                case 'unsubscribe':
                    dlog.trace();
                    try{
                        verifyOrThrow(json.topic,"Please send the topic");
                        this.removeTopic(json.topic);
                    } catch(err){
                        dlog.err(err)
                        this.sendError(topic, "unsubscribe_ack", err.message)
                    }
                    break;
                case "message":
                    dlog.trace();
                    try{
                        this.propagateMessage(topic, json.message)
                    } catch(err){
                        dlog.err(err)
                        this.sendError(topic, "message_ack", err.message);
                    }
                    break;
                default:
                    dlog.trace();
                    this.sendError(topic, "unsubscribe_ack", `You must send a message with topic subscribe | unsubscribe | message`)

            }
    }

    removeTopic(topic: string) {
        if(!this.mTopicConfigMap.has(topic)){
            throw Error(`already unsubscribed ${topic}`)
        }
        this.propagateMessage(topic, `${this.mTopicConfigMap.get(topic).username} unsubscribed ${this.mTopicConfigMap.get(topic).topic}`)
        topicManager.removeConnection(topic, this);
        this.mTopicConfigMap.delete(topic);
    }

    private handleBinaryData(data:any){
        this.sendError("default", "unknown", "Binary Data is not supported");
    }

    isOpen():boolean{
        return this.ws.readyState == OPEN;
    }

    sendError(topic:string, type:string, msg:string, ){
        dlog.trace();
        if( this.mTopicConfigMap.get(topic) && this.mTopicConfigMap.get(topic).debug){
            this.ws.send(JSON.stringify({'type':type,'data':msg,'status':'error', 'stack': new Error().stack}))
        } else {
            this.ws.send(JSON.stringify({'type':type,'data':msg,'status':'error', 'stack': new Error().stack}))
        }
    }

    sendMessage(type, msg:string){
        dlog.trace();
        this.ws.send(JSON.stringify({'type':type,'data':msg}))
    }

    propagateMessage(topic:string, message:any){
        dlog.trace();
        verifyOrThrow(message, "the message is null or undefined")
        let peers = topicManager.getPeers(topic);
        verifyOrThrow(peers.length > 0, "No one listening to this topic")
        peers.forEach(function(peerConn){
            if(peerConn == this && !this.mTopicConfig.isLookBack){
               // TODO:
            }
            if(peerConn.isOpen()){
                peerConn.sendMessage("message", message);
            }
        })
    }
}