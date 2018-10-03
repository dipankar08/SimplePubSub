var SimplePubSub = (function(){
    var URL="ws://0.0.0.0:8081"
    var callbacks = new Array()
    var ws = null;

    subscribe = function(topic){
        ensureInit();
        ws.send(JSON.stringify({"type":"subscribe","topic":topic}))
    }

    unsubscribe = function(topic){
        ensureInit();
        ws.send(JSON.stringify({"type":"unsubscribe","topic":topic}))
    }

    publish = function(topic, data){
        ensureInit();
        ws.send(JSON.stringify({"type":"message","topic":topic,"data":data}))
    }

    attach = function(callback){
        ensureInit();
        callbacks.push(callback);
    }

    ensureInit = function(){
        if(!ws){
            init();
        }
    }

    init = function(config){
        URL = config && config.url ? config.url : URL;
        ws = new WebSocket(URL)
        ws.onopen = function(){ 
            console.log("[SimplePubSub] onConnect")
            callbacks.forEach(function(cb){
                cb.onConnect();
            });
        }
    
        ws.onclose = function(){ 
            console.log("[SimplePubSub] onDisconnect")
            callbacks.forEach(function(cb){
                cb.onDisconnect();
            });
        }
    
        ws.onerror = function(error){ 
            console.log("[SimplePubSub] onError")
            callbacks.forEach(function(cb){
                cb.onError(error);
            });
        }

        ws.onmessage = function(responce){
            var msg = JSON.parse(responce.data);
            console.log("[SimplePubSub] onmessage called")
            switch(msg.type){
                case 'message':
                    callbacks.forEach(function(cb){
                        cb.onMessage(msg.topic, msg.data);
                    });
                    break;
                default:
                    callbacks.forEach(function(cb){
                        cb.onSignal(msg.topic, msg.data);
                    });
                    break;
            }
        }
    }

    connect =  function(){
        ws = new WebSocket(URL)
    }

    disconnect = function (){

    }

    return {
        init:init,
        connect:connect,
        disconnect:disconnect,
        subscribe:subscribe,
        unsubscribe:unsubscribe,
        publish:publish,
        attach:attach
    }
})();

/* 

T E S T   E X A M P L E
------------------------------------------
SimplePubSub.init()
SimplePubSub.attach({
    'onConnect':function(){console.log("[TEST] onConnect")},
    'onDisconnect':function(){console.log("[TEST] onDisconnect")},
    'onError':function(){console.log("[TEST] onError")},
    'onMessage':function(t,d){console.log("[TEST] onMessage : topic:"+t+" Data:"+d)},
    'onSignal':function(t,d){console.log("[TEST] onSignal -> Topic:"+t+" data:"+d)}
})
SimplePubSub.subscribe("hello")
SimplePubSub.publish("hello","sent hello")
SimplePubSub.publish("hello1","sent hello")
SimplePubSub.publish("hello2","sent hello")
SimplePubSub.unsubscribe("hello")
SimplePubSub.publish("hello","sent hello")

*/