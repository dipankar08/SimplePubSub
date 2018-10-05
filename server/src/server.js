const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8081 });
var connectionList = new Map()
var topicMaps = new Map()
wss.on('connection', function connection(ws) {
    connectionList.set(ws,{});
    console.log("[SimplePubSub] new connection, Now total:"+connectionList.size)

    ws.on('message', function incoming(obj) {
        var msg = JSON.parse(obj);
        switch(msg.type){
            case 'subscribe':
                var topic = msg.topic
                if(!topic){
                    ws.send(JSON.stringify({'type':'signal','topic':'subscribe_ack','data':'Not able to subscribe as topic not sent.'}))
                    return;
                }

                if(!topicMaps.has(topic)){
                    topicMaps.set(topic, new Set())
                }

                if(!topicMaps.get(topic).has(ws)){
                    topicMaps.get(topic).add(ws);
                } else{
                    console.log("[SimplePubSub] topic already exist. "+ws)
                }

                ws.send(JSON.stringify({'type':'signal','topic':'subscribe_ack','data':'success'}))
                console.log("[SimplePubSub] Subscribe done: Topic: "+topic +" => "+ topicMaps.get(topic).size)
                break;
            case 'unsubscribe':
                var topic = msg.topic
                if(!topic){
                    ws.send(JSON.stringify({'type':'signal','topic':'unsubscribe_ack','data':'Not able to subscribe as topic not sent.'}))
                    return;
                }

                if(topicMaps.has(topic)){
                    if(topicMaps.get(topic).has(ws)){
                        topicMaps.get(topic).delete(ws);
                    } else{
                        console.log("[SimplePubSub] this client not subscibe this topic. ")
                    }
                }
                ws.send(JSON.stringify({'type':'signal','topic':'unsubscribe_ack','data':'success'}))
                console.log("[SimplePubSub] Unsubscribe done: Topic: "+topic +" => "+ topicMaps.get(topic).size)
                break;
            case 'message':
                var topic = msg.topic
                var data = msg.data;
                matchClients = topicMaps.get(topic);
                if(matchClients && matchClients.size > 0){
                    console.log("[SimplePubSub] message forword on Topic :"+topic+" to "+matchClients.size+" endpoints.")
                    matchClients.forEach(function(client) {
                        if(client.readyState == client.OPEN){
                            client.send(JSON.stringify({'type':'message','topic':topic, 'data':data}));
                        } else {
                            matchClients.delete(client);
                            console.log("[SimplePubSub] Error: Try to send send msg to closed client")
                        }
                    });
                } else{
                    console.log("[SimplePubSub] No matched client found to fwd.")
                }
                break;
        }
    });

    ws.on('close', function(connection) {
        console.log("[SimplePubSub] connection closed")
        topicMaps.forEach(function(val, key){
            if(val && val.size > 0){
                val.forEach(function(c){
                    if(c === ws){
                        val.delete(ws);
                    }
                });
            }
        })

        connectionList.delete(ws)
        console.log("[SimplePubSub] delete endpoint, Now total:"+connectionList.size)
    });
});


console.log("[SimplePubSub] Server started  on port 8081.")
