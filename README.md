# Why SimplePubSub ?
Welcome to world's simple signaling solution. If you are prototyping some prioject which requirs realtime communication between multiple devices( or endpoints), you are in the right place. 

SimplePubSub provides a quick and darty way to test your prototype. The API is easy and quick - however not scalable. 


# SDK
I wrote the simple and handly API for signaling mutiple parties which is connected to SimplePubSub server. Currently sdk is written is java and javascript - but fell free to write your own and contibute it here. 

## JavaScript
1. Import the js file in your webpage.
```
<script> https://raw.githubusercontent.com/dipankar08/SimplePubSub/master/server/sdk/client.js </script>
```
2. Connect to Server - This Steps is optinal if you want to use defaut free server.
```
SimplePubSub.init()
```
3. Attach the callbacks 
```
SimplePubSub.attach({
    'onConnect':function(){console.log("[TEST] onConnect")}, // called when the connection established 
    'onDisconnect':function(){console.log("[TEST] onDisconnect")}, // called when disconnect
    'onError':function(){console.log("[TEST] onError")}, // called when error 
    'onMessage':function(t,d){console.log("[TEST] onMessage : topic:"+t+" Data:"+d)}, // called when someone send message
    'onSignal':function(t,d){console.log("[TEST] onSignal -> Topic:"+t+" data:"+d)} // send any siging message like 
})
```

3. Subscribe the topic of your interest.
```
SimplePubSub.subscribe("hello")
```

4. Start publishing you data. As you have subscribed, your data will send to all other device in realtime.
```
SimplePubSub.publish("hello","sent hello")
```

5. If you dont want to get the message for a topic, you can unsubscibe it.
```
SimplePubSub.unsubscribe("hello")
SimplePubSub.publish("hello","sent hello") // will not send the event. 
```

# SERVER
You can follow 3 quick steps to setup the server. This is build on top of nodejs and ws. So please make sure that we have the latest version of nodejs and npm insatll in your devserver.
1. Clone the repro.
2. go to SimplepubSub and run <npm install>.
3. run <npm start>
 
Congratulation your server is running in port 8081. 
