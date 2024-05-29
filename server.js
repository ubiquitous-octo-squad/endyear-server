const websocket = require('ws');

const wss = new websocket.WebSocketServer({ port: 8082 });
let userClientMap = {}; 

wss.on('connection', (ws, req) => {
    ws.on('error', console.error);

    ws.on('message', (message) => {
        let data = JSON.parse(message);
        switch (data.req_type) {
            case "authentication":
                ws.send("you're authenticated wow!!! so secure am i right");
                // do stuff with data.body.token, query for this is in queries.sql
                break;
            case "send message":
                ws.send("uh oh why is this happening");
                // do message stuff (no part implemented yet, use data.body.somethingOrWhatever)
                break;
        };
    });
})