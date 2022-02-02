// let mysql = require('mysql')
const Sequelize = require('sequelize');

let connection = new Sequelize(
    process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS,
    host: '/tmp/.s.PGSQL.5432', dialect='postgres'
);

// let connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE
// })

connection.connect(); // necessary with sequalize?

module.exports = connection;
