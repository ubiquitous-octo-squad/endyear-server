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

            await poolConnection.request().query(`INSERT INTO Messages (msg, sender)
            VALUES ('${request.query.get('message')}', '${request.query.get('sender')}');`);

            poolConnection.close();
        } catch (err) {
            return { body: `failure. Error is ${err}` }
        }


        //const name = request.query.get('name') || await request.text() || 'world';

        return { body: `success` };
    }
});
