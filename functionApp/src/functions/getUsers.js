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

app.http('getUsers', {
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
                .input('chatId', sql.Int, parseInt(request.query.get("chatId")))
                .query(`SELECT person_id FROM chat_person
                WHERE chat_id = @chatId`);

            poolConnection.close();
            return result;
        } catch (err) {
            return { body: `failure. Error is ${err}` }
        }


        //const name = request.query.get('name') || await request.text() || 'world';

        
    }
});
