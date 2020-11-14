
import { IncomingMessage } from "http";
import WebSocket, { OPEN } from "ws"
import { verifyOrThrow } from "./Assert";
import { dlog } from "./dlog";
import { topicManager } from "./RoomManager";
import { defaultTopicConfig, TopicConfig, topicConfigManager } from "./TopicsConfigManager";

export class Connection {
    ws: WebSocket;
    mTopicConfig: TopicConfig;
    mTopic:string;
    mUsername:string ="Guest User"

    constructor(webSocket: WebSocket) {
      dlog.trace();
      this.ws = webSocket;
      this.mTopicConfig = defaultTopicConfig;
      this.mTopic = ""
    }
    
    handleOpen(req: IncomingMessage) {
        dlog.trace();
        // DO Nothing until they subscibe
    }

    handleClose(code: number) {
        dlog.trace();
        try{
            this.propagateMessage(`${this.mUsername} leaved`)
            topicManager.removeConnection(this);
        } catch(e){
            
        }
    }


    handleMessage(data:any){
        dlog.trace();
        try{
            var msg = JSON.parse(data);
            this.handleJsonData(msg);
        } catch(err){
            this.handleBinaryData(data);
        }
    }

    private handleJsonData(json:any){
        dlog.trace();
            switch(json.type) {
                case 'subscribe':
                    dlog.trace();
                    try{
                        verifyOrThrow(json.topic,"Please send the topic");
                        topicManager.addConnection(json.topic, this);
                        this.mTopicConfig = topicConfigManager.buildConfig(json.topic,json);
                        this.propagateMessage(`${this.mUsername} joined`)
                    } catch(err){
                        this.sendError("subscribe_ack", err.message)
                    }
                    break;
                case 'unsubscribe':
                    dlog.trace();
                    try{
                        this.handleClose(0);
                    } catch(err){
                        this.sendError("unsubscribe_ack", err.message)
                    }
                    break;
                case "message":
                    dlog.trace();
                    try{
                        this.propagateMessage(json.message)
                    } catch(err){
                        this.sendError("message_ack", err.message);
                    }
                    break;
                default:
                    dlog.trace();
                    this.sendError("unsubscribe_ack", `You must send a message with topic subscribe | unsubscribe | message`)

            }
    }

    private handleBinaryData(data:any){
        this.sendError("unknown", "Binary Data is not supported");
    }

    isOpen():boolean{
        return this.ws.readyState == OPEN;
    }

    sendError(topic:string, msg:string){
        dlog.trace();
        if(this.mTopicConfig.isDebug){
            this.ws.send(JSON.stringify({'topic':topic,'data':msg,'status':'error', 'stack': new Error().stack}))
        } else {
            this.ws.send(JSON.stringify({'topic':topic,'data':msg,'status':'error'}))
        }
        
    }

    sendMessage(topic, msg:string){
        dlog.trace();
        this.ws.send(JSON.stringify({'topic':topic,'data':msg}))
    }

    propagateMessage(message:any){
        dlog.trace();
        verifyOrThrow(message, "the message is null or undefined")
        let peers = topicManager.getPeers(this);
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