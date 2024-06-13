const ws = require('ws');

const dotenv = require('dotenv');
dotenv.config();

//const client = new ws.WebSocket("wss://endyear-server.onrender.com"); // actual server
const client = new ws.WebSocket("ws://127.0.0.1:443"); // localhost test server

let token = "unsdAqd";
let message = "Hello!!"
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

    // client.send(JSON.stringify({
    //     req_type: "fetch messages",
    //     body: {
    //         chat: chatId,
    //         token: token
    //     }
    // }))
    console.log("client open");
});

client.on('message', (data) => {
    console.log("Recieved message: " + data);
});