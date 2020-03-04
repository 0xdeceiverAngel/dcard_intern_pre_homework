var mysql = require('mysql');
var express = require('express');
// const publicIp = require('public-ip');
var router = express();

var sql_connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'account'
});
sql_connection.connect();

router.get('/', function (req, res) {


    res.status(200);
    res.set({
        'Error': '0',
        'X-RateLimit-Remaining': '',
        'X-RateLimit-Reset': ''
    });
    res.send('server on');





});
router.get('/alldata', function (req, res) {
    var sql = "SELECT * FROM ip_table";

    sql_connection.query(sql, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }
        res.send(result);
        result.forEach(element => {
            console.log(element);

        });
    });


    res.status(200);
    // res.send('server on');
});
var ip;
router.get('/draw', function (req, res) {
    var sql;
    var req_times;

    ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    sql = "SELECT req_times FROM ip_table  WHERE ip_addr=\"" + ip + "\"";
    // sql = "SELECT req_times FROM ip_table  WHERE ip_addr=\"" +'123'+"\"";


    // console.log(sql);
    // console.log(ip);


    sql_connection.query(sql, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }
        if (result[0] == null) {
            console.log('empty');
            sql = "INSERT INTO `account`.`ip_table` (`ip_addr`, `req_times`, `dead_time`) VALUES (\"" + ip + "\",'1', NULL)";
            // console.log(sql);
            req_times = 1;
            sql_connection.query(sql, function (err, result) {
                if (err) {
                    console.log('[SELECT ERROR] - ', err.message);
                    return;
                }
                res.status(200);
                res.set({
                    'Error': '0',
                    'X-RateLimit-Remaining': 1000 - req_times,
                    'X-RateLimit-Reset': ''
                });
                res.send(ip + "    " + req_times + "times");

            });
        }
        else {
            console.log("not empty");


            req_times = result[0]['req_times'] + 1;
            if (req_times > 999) {

                var current_datetime=new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                console.log(current_datetime);
                res.status(429);
                res.set({
                    'Error': '0',
                    'X-RateLimit-Remaining': 1000 - req_times,
                    'X-RateLimit-Reset': ''
                });
                res.send('ip block');
                
            }
            else {
                // console.log(req_times);
                res.status(200);
                res.set({
                    'Error': '0',
                    'X-RateLimit-Remaining': 1000 - req_times,
                    'X-RateLimit-Reset': ''
                });
                res.send(ip + "    draw" + req_times + "times");
                sql = "UPDATE `account`.`ip_table` SET `req_times`='" + req_times + "' WHERE  `ip_addr`=\"" + ip + "\"";
                console.log(sql);
                req_times = 1;
                sql_connection.query(sql, function (err, result) {
                    if (err) {
                        console.log('[SELECT ERROR] - ', err.message);
                        return;
                    }

                });
            }



        }

    });



});
// INSERT INTO `account`.`ip_table` (`ip_addr`, `req_times`, `dead_time`) VALUES ('159.6.2.55', '20', '2020-03-04 20:44:01');

router.listen(80, function () {
    console.log('Example app listening on port 80!');
});



// http.createServer(function (request, response) {

//     // 发送 HTTP 头部 
//     // HTTP 状态值: 200 : OK
//     // 内容类型: text/plain
//     response.writeHead(200, { 'Content-Type': 'text/plain' });
//     response.writeHead(200, { 'Error': '1' });


//     // 发送响应数据 "Hello World"
//     response.end('Hello World\n');
// }).listen(8888);




// var sql = "SELECT * FROM file_path";


// connection.end();

