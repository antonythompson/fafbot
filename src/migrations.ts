import config from './config';
import pg from 'pg';
import { migrate } from 'postgres-migrations';
const connection = pg.createPool({
    connectionLimit : 10,
    host: config,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

migrate(connection, './migrations');