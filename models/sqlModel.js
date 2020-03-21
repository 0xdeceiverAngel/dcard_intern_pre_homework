var mysql = require('mysql');
var sql_connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'account'
});
sql_connection.connect();

const promiseQuery = (sql) => {
  return new Promise((resolve, reject) => {
    sql_connection.query(sql, function (err, result) {
      if (err) {
        res.send(err);
        console.log('[SELECT ERROR] - ', err.message);
        return;
      }
      resolve(result);
    });
  });
}


module.exports = promiseQuery;
