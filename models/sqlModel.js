var mysql = require('mysql');
var sql_connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'account'
  });
  sql_connection.connect();

module.exports = sql_connection;
