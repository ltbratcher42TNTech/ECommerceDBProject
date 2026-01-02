const mysql = require('mysql2/promise');
require('dotenv').config({ path: __dirname + '/../.env' }); // I DID user AI here, as I was having issues with connections

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = connection;
