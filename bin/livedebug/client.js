var SimplePubSub = (function(){
    var callbacks = new Array()
    var ws = null;

    addCallback = function (callback){
        callbacks.push(callback);
    }

    send = function(data){
        ensureInit();
        ws.send(data);
    }

    ensureInit = function(){
        if(!ws){
            init();
        }
    }

    init = function(){
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
            ws = null;
        }
    
        ws.onerror = function(error){ 
            console.log("[SimplePubSub] onError")
            callbacks.forEach(function(cb){
                cb.onError(error);
            });
        }

        ws.onmessage = function(responce){
            //var msg = JSON.parse(responce.data);
            callbacks.forEach(function(cb){
                cb.onMessage(responce.data);
            });
            console.log("[SimplePubSub] onmessage called")
        }
    }

    connect =  function(url){
        if(!ws){
            try{
                ws = new WebSocket(url)
                init();
            } catch(err){
                callbacks.forEach(function(cb){
                    cb.onError(err.message);
                });
            }
        } else {
            ws.close();
        }
    }
    return {
        connect:connect,
        send:send,
        addCallback:addCallback,
    }
})();
