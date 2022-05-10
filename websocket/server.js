// Node.js WebSocket server script
const http = require('http');
const robot = require('robotjs');
const WebSocketServer = require('websocket').server;
const cors = require('cors');
const fs = require('fs')


const server = http.createServer();
server.listen(9898);

const wsServer = new WebSocketServer({
    httpServer: server
});

wsServer.on('request', function(request) {
    const connection = request.accept(null, request.origin);
    connection.on('message', function(message) {
      // console.log('Received Message:', message.utf8Data);
      
      var obj = JSON.parse(message.utf8Data);
      switch(obj.data){
        case "mouseMovement":
          robot.moveMouse(obj.x,obj.y);
          break;
        case "click":
          robot.mouseClick("left");
          break;
        case "keyEvent":
          key = obj.key.toLowerCase().replace("arrow","").replace("meta","command");
          if(obj.event == "down"){
            console.log(key+":  down");
            robot.keyToggle(key,"down");
          } else {
            console.log(key+":  up")
            robot.keyToggle(key,"up");
          }
          break;
        case "reloadVideoRequest":
          robot.moveMouse
        
      }
      connection.sendUTF('Websocket server // handshake');
    });
    connection.on('close', function(reasonCode, description) {
        console.log('Client has disconnected.');
    });
});