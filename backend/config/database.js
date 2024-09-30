const pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'orchestras',
    password: 'postgres',
    port: 5432,
});

module.exports = pool;
