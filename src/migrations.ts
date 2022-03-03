require('dotenv').config();
// const mysql = require('mysql');
const pg = require('pg');
const migration = require('postgres-migrations');
const connection = pg.createPool({
    connectionLimit : 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

migration.init(connection, './migrations');
