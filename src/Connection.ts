
import { IncomingMessage } from "http";
import WebSocket, { OPEN } from "ws"
import { verifyOrThrow } from "./Assert";
import { dlog } from "./dlog";
import { topicManager } from "./RoomManager";
import { defaultTopicConfig, TopicConfig, topicConfigManager } from "./TopicsConfigManager";
import { IObject } from "./utils";

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
                this.handleUnsubscribe({topic:topic});
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

    private handleJsonData(json:IObject){
        dlog.trace();
        let topic = json.topic || "default";
            switch(json.type) {
                case 'subscribe':
                    dlog.trace();
                    try{
                        this.handleSubscribe(json);
                        this.sendPeers("subscribe_ack", topic, `${this.mTopicConfigMap.get(topic).username} subscribed ${topic}`)
                    } catch(err){
                        dlog.err(err)
                        this.sendError(topic, "subscribe_ack", err.message)
                    }
                    break;
                case 'unsubscribe':
                    dlog.trace();
                    try{
                         
                            this.handleUnSubscribe(json);
                    } catch(err){
                        dlog.err(err)
                        this.sendError(topic, "unsubscribe_ack", err.message)
                    }
                    break;
                case "message":
                    dlog.trace();
                    try{
                        this.sendJsonToPeers(json)
                        this.sendSelf("message_ack",`message sent to topic: ${topic}`);
                    } catch(err){
                        dlog.err(err)
                        this.sendError(topic,"message_ack", err.message);
                    }
                    break;
                case "reset":
                    dlog.trace();
                    try{
                        this.sendSelf("reset_ack", "reset done --- TODO --")
                    } catch(err){
                        dlog.err(err)
                        this.sendError(topic, "reset_ack", err.message);
                    }
                    break;
                case "status":
                    dlog.trace();
                    try{
                        this.sendSelf("status_ack", "status is: -- TODO --")
                    } catch(err){
                        dlog.err(err)
                        this.sendError(topic, "status_ack", err.message);
                    }
                    break;
                default:
                    dlog.trace();
                    this.sendError(topic, "unsubscribe_ack", `You must send a message with topic subscribe | unsubscribe | message`)

            }
    }

    handleSubscribe(json: IObject) {
        verifyOrThrow(json.topic,"Please send the topic");
        topicManager.addConnection(json.topic, this);
        this.mTopicConfigMap.set(json.topic, topicConfigManager.buildConfig(json.topic,json));
    }

    handleUnSubscribe(json: IObject) {
        verifyOrThrow(json.topic,"Please send the topic");
        if(!this.mTopicConfigMap.has(json.topic)){
            throw Error(`already unsubscribed ${json.topic}`)
        }
        let username = this.mTopicConfigMap.get(json.topic).username;
        this.sendPeers("unsubscribe_ack", json.topic, `${username} unsubscribed ${json.topic}`)
        
        topicManager.removeConnection(json.topic, this);
        this.mTopicConfigMap.delete(json.topic);
    }

    private handleBinaryData(data:any){
        this.sendError("default", "unknown", `Binary Data is not supported yet, Please send a string encoded JSON:${data}`);
    }

    isOpen():boolean{
        return this.ws.readyState == OPEN;
    }

    sendError(topic:string, type:string, msg:string, ){
        dlog.trace();
        if( this.mTopicConfigMap.get(topic) && this.mTopicConfigMap.get(topic).debug){
            this.ws.send(JSON.stringify({'type':type,'data':msg,'status':'error', 'stack': new Error().stack}))
        } else {
            this.ws.send(JSON.stringify({'type':type,'data':msg,'status':'error'}))
        }
    }

    private sendSelf(type:string, msg:string){
        dlog.trace();
        this.ws.send(JSON.stringify({'type':type,'message':msg}))
    }

    private selfSendJson(json:IObject){
        dlog.trace();
        this.ws.send(JSON.stringify(json))
    }

    sendPeers(type:string, topic:string, message:any){
        dlog.trace();
        verifyOrThrow(message, "the message is null or undefined")
        let peers = topicManager.getPeers(topic);
        verifyOrThrow(peers.length > 0, "No one listening to this topic")
        peers.forEach(function(peerConn){
            if(peerConn == this && !this.mTopicConfig.isLookBack){
               // TODO:
            }
            if(peerConn.isOpen()){
                peerConn.selfSendJson({type:type,topic:topic, message:message});
            }
        })
    }
    sendJsonToPeers(json:IObject){
        dlog.trace();
        verifyOrThrow(json.topic, "Please send the intended topic")
        verifyOrThrow(json.message, "the message is null or undefined")
        verifyOrThrow(this.mTopicConfigMap.has(json.topic), "You must subscribe the topic first");
        let peers = topicManager.getPeers(json.topic);
        verifyOrThrow(peers.length > 0, "No one listening to this topic")
        peers.forEach(function(peerConn){
            if(peerConn == this && !this.mTopicConfig.isLookBack){
               // TODO:
            }
            if(peerConn.isOpen()){
                peerConn.selfSendJson(json);
            }
        })
    }
}