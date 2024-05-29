const ws = require('ws');

const client = new ws.WebSocket("ws://127.0.0.1:8082");

client.on('error', console.error);

client.on('open', () => {
    client.send('hiii');
    console.log("client open");
});

client.on('message', (data) => {
    console.log("Recieved message: " + data);
});