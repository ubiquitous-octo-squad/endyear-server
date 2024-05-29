const websocket = require('ws');

const wss = new websocket.WebSocketServer({ port: 8082 });
let userClientMap = {} 

wss.on('connection', function connection(ws, req) {
    console.log("established connection");
    ws.send("CONNECTION ESTABLISHED");
    ws.on('error', console.error);

    ws.on('message', (data) => {
        console.log("Recieved message: " + data);
        ws.send("pong");
    });
})