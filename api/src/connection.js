const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

connection.connect(err => {
  if (err) {
    console.error('DB connection error:', err);
    process.exit(1); // stop server if DB connection fails
  } else {
    console.log('Connected to database');
  }
});

module.exports = connection;
