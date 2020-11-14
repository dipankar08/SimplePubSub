import WebSocket from "ws"

export function verifyOrThrow(cond, msg:string){
    if(!cond){
        throw Error(msg);
    }
}