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

app.http('authorize', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);
        context.log(config);
        let x = {};
        try {
            var poolConnection = await sql.connect(config);
            context.log(request);
            context.log(request.query.get("tokenString"))
            x = await poolConnection.request()
                .input('tokenString', sql.VarChar(255), request.query.get("tokenString")) // may be VarChar and not VarChar(255)
                .query(`SELECT id FROM token JOIN person ON token.person = person.id WHERE token = @tokenString`);
            context.log(x);
            poolConnection.close();
        } catch (err) {
            return { body: `failure. Error is ${err}` }
        }


        //const name = request.query.get('name') || await request.text() || 'world';

        return { body: JSON.stringify(x) };
    }
});
