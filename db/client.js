const { Client } = require('pg');

const client = new Client({
    user: 'aom91',
    database: 'gamestore',
    password: 'password1',
    port: 5432
});

module.exports = client;