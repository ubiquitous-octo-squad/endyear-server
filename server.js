const websocket = require('ws');

const wss = new websocket.WebSocketServer({ port: 8082 });
let userClientMap = {} 

wss.on('connect', function connection(ws, req) {
    console.log(`WS:\n${ws}\n\nREQ:\n${req}\n\nREQ.BODY??\n${req.body}`);
})