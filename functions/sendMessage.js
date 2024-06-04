const { app } = require('@azure/functions');

const sql = require('mssql');
const dotenv = require('dotenv');
dotenv.config();

const config = {
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    }
}

app.http('sendMessage', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);
        context.log(config);
        try {
            var poolConnection = await sql.connect(config);
            context.log(request);

            // SQLI-Proof
            let result = await poolConnection.request()
                .input('text', sql.VarChar(255), request.body.message) // it may be sql.VarChar (no parentheses) instead of sql.VarChar(255). Needs to be tested.
                .input('sender', sql.Int, request.body.sender)
                .input('chatId', sql.Int, request.body.chatId)
                .query(`INSERT INTO msg(text, sender, chat)
                VALUES (@text, @sender, @chatId);`);

            poolConnection.close();
        } catch (err) {
            return { body: `failure. Error is ${err}` }
        }


        //const name = request.query.get('name') || await request.text() || 'world';

        return { body: `success` };
    }
});
