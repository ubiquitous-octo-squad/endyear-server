
const ws = require('ws');

const dotenv = require('dotenv');
dotenv.config();

//const client = new ws.WebSocket("wss://endyear-server.onrender.com"); // actual server
const client = new ws.WebSocket("ws://127.0.0.1:443"); // localhost test server

let token = "74b619eb4365d5d39dd0d1c37d17683096767e70";
let message = "Haiii but even gayer to spite michael"
let chatId = 1;

client.on('error', console.error);

client.on('open', () => {
    client.send(JSON.stringify({
        req_type: "authentication", // include in every request
        body: { // include data where necessary of any type
            token: token
        }
    }));

    // send example message (don't have in client.on('open'))
    client.send(JSON.stringify({
        req_type: "send message",
        body: {
            message: message,
            sender: token, // use token to authorize sender because why not
            chat: chatId
        }
    }))
    console.log("client open");
});

client.on('message', (data) => {
    console.log("Recieved message: " + data);
});