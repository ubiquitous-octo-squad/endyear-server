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

app.http('fetchMessages', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);
        context.log(config);
        let x = {};
        try {
            var poolConnection = await sql.connect(config);
            context.log(request);

            x = await poolConnection.request().query(`SELECT Top 255 text,timestamp,username,pfp
            FROM msg
            JOIN user ON msg.user_id = user.id
            WHERE chat_id = ${request.body.chat_id /* chat id needs to be sent in the request to get messages */}
            ORDER BY send_time desc`);

            poolConnection.close();
        } catch (err) {
            return { body: `failure. Error is ${err}` }
        }


        //const name = request.query.get('name') || await request.text() || 'world';

        return { body: JSON.stringify(x) };
    }
});
