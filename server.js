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
                axios.post(`https://messagehandlers.azurewebsites.net/api/authorize?tokenString=${data.body.token}`).then((id) => {
                    if (!id) {
                        ws.send(JSON.stringify({
                            confirmation: "denied"
                        }))
                        ws.close();
                        console.log("faker smh");
                        return;
                    };
                    userClientMap[id.data] = ws;
                    ws.send(JSON.stringify({
                        confimation: "confirmed"
                    })); // temp message; do something real here
                });
                break;
            case "send message":
                // get id of sender
                axios.post(`https://messagehandlers.azurewebsites.net/api/authorize?tokenString=${data.body.sender}`).then((d) => {
                    let sender = d.data;
                    if (!sender) {ws.close(); console.log("faker smh 2??"); return -1};

                    let senderName;
                    axios({
                        method: 'post',
                        url: `https://messagehandlers.azurewebsites.net/api/insertMessage?sender=${sender}&chatId=${data.body.chat}`,
                        headers: {
                            'text': data.body.message
                        },
                        data: {}
                    }).then((d) => {
                        senderName = d.data;
                        if (!senderName) {ws.close(); console.log("invalid chat-user pairing"); return -1}


                        axios.post(`https://messagehandlers.azurewebsites.net/api/getUsers?chatId=${data.body.chat}`).then((users) => {
                        let u = users.data.split(",");
                        if (!u) { console.log('uh oh!'); return};
                        u.forEach(user => {
                            if (userClientMap[user]) {
                                userClientMap[user].send(JSON.stringify({
                                    message: data.body.message,
                                    sender: senderName,
                                    chat: data.body.chatId
                                }));
                            };
                        });
                      });
                    });
                });
                break;
            case "fetch messages":
                console.log(data)
                axios.post(`https://messagehandlers.azurewebsites.net/api/fetchMessages?chatId=${data.body.chat}&tokenString=${data.body.token}`).then((d) => {console.log(d.data)});
                break;
        };
    });

    ws.on('close', () => {
        Object.keys(userClientMap).forEach((id) => {
            if (userClientMap[id] === ws) delete userClientMap[id];
        })
    });
});