const websocket = require('ws');
const axios = require('axios');

const wss = new websocket.WebSocketServer({ port: 443 });
let userClientMap = {};

wss.on('connection', (ws) => {
    ws.on('error', console.error);

    ws.on('message', (message) => {
        let data = JSON.parse(message);
        switch (data.req_type) {
            case "authentication":
                let user;
                axios.post(`https://messagehandlers.azurewebsites.net/api/authorize?tokenString=${data.body.token}`).then((d) => user = d.data?.recordset?.[0]?.id).then(()=>{
                    if (!user) {ws.close(); return};
                    userClientMap[user] = ws;
                    ws.send("authenticated"); // temp message; do something real here
                });
                break;
            case "send message":
                // get id of sender
                let sender;
                axios.post(`https://messagehandlers.azurewebsites.net/api/authorize?tokenString=${data.body.token}`).then((d) => sender = d.data?.recordset?.[0]?.id).then(()=>{
                    if (!sender) {ws.close(); return};
                });

                let senderName;
                axios.post(`https://messagehandlers.azurewebsites.net/api/sendMessage?message=${data.body.message}&sender=${sender}&chatId=${data.body.chatId}`).then((d) => senderName = d.data?.recordset?.[0]?.username); // WARNING: may cause an issue if someone puts a slash (/) in their message due to URL handling. Fix later.

                axios.post(`https://messagehandlers.azurewebsites.net/api/getUsers?chatId=${data.body.chatId}`).then((users) => {
                    let u = users?.data?.recordset;
                    if (!u) return;
                    u.array.forEach(user => { // VSCode added the .array, may not be wanted.
                        userClientMap[user.id].send(JSON.stringify({
                            messageText: data.body.message,
                            sender: senderName
                        }))
                    });
                });
                break;
        };
    });

    ws.on('close', () => {
        //TODO: userclientmap cleaning
    });
});