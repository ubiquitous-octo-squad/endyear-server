const ws = require('ws');

const dotenv = require('dotenv');
dotenv.config();

//const client = new ws.WebSocket(process.env.WS_SERVER); // actual server
const client = new ws.WebSocket("ws://127.0.0.1:8082"); // localhost test server

let token = "blah blah blah we'll get this later"

client.on('error', console.error);

client.on('open', () => {
    client.send(JSON.stringify({
        req_type: "authentication", // include in every request
        body: { // include data where necessary of any type
            token: token
        }
    }));
    console.log("client open");
});

client.on('message', (data) => {
    console.log("Recieved message: " + data);
});