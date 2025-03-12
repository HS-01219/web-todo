const mariadb = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

// db 연결 정보
const connection = mariadb.createConnection({
  host: 'localhost',
  user: process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database: 'ToDo',
  dateStrings : true
});

module.exports = connection;