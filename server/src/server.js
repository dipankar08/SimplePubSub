const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8081 });
var connectionList = new Map()
var topicMaps = new Map()
wss.on('connection', function connection(ws) {
    console.log("[SimplePubSub] new connection"+ws)
    connectionList[ws]={};

    ws.on('message', function incoming(obj) {
        var msg = JSON.parse(obj);
        console.log("[SimplePubSub] message Received:"+msg)
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
                    console.log("[SimplePubSub] topic added. "+ws)
                } else{
                    console.log("[SimplePubSub] topic already exist. "+ws)
                }

                ws.send(JSON.stringify({'type':'signal','topic':'subscribe_ack','data':'success'}))
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
                        console.log("[SimplePubSub] topic deleted. "+ws)
                    } else{
                        console.log("[SimplePubSub] this client not subscibe this topic. "+ws)
                    }
                }
                ws.send(JSON.stringify({'type':'signal','topic':'unsubscribe_ack','data':'success'}))

                break;
            case 'message':
                var topic = msg.topic
                var data = msg.data;
                matchClients = topicMaps.get(topic);
                if(matchClients && matchClients.size > 0){
                    console.log("[SimplePubSub] message forword to "+matchClients.length+" clients.")
                    matchClients.forEach(function(client) {
                        client.send(JSON.stringify({'type':'message','topic':topic, 'data':data}));
                    });
                } else{
                    console.log("[SimplePubSub] No matched client found to fwd/")
                }
                break;
        }
    });

    ws.on('close', function(connection) {
        console.log("[SimplePubSub] connection closed"+ws)
        delete connectionList[ws]
    });
});


console.log("[SimplePubSub] Server started  on port 8081.")