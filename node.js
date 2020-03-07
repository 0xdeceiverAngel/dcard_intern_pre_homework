var mysql = require('mysql');
var express = require('express');
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
            res.send(err);
            console.log('[SELECT ERROR] - ', err.message);
            return;

        }
        res.send(result);
        result.forEach(element => {
            console.log(element);
        });
    });
});

var ip;
var current_datetime;

router.get('/draw', function (req, res) {
    var sql;
    var req_times;

    ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    sql = "SELECT req_times FROM ip_table  WHERE ip_addr=\"" + ip + "\""; //check ip is in db or not
    sql_connection.query(sql, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }

        if (result[0] == null) {//if ip not in db
            console.log('ip not in db');
            sql = "INSERT INTO `account`.`ip_table` (`ip_addr`, `req_times`, `dead_time`) VALUES (\"" + ip + "\",'1', NULL)";
            req_times = 1;
            sql_connection.query(sql, function (err, result) { //set new ip in to db
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
        else {  //if ip in db
            console.log("ip in db");


            req_times = result[0]['req_times'] + 1;
            if (req_times > 999) {  //check req_time 
                // if >999
                current_datetime = new Date();
                current_datetime.setHours(current_datetime.getHours() + 1 + 8);//+8 是因為時差 
                current_datetime = current_datetime.toISOString().slice(0, 19).replace('T', ' ');

                sql = "SELECT dead_time FROM ip_table  WHERE ip_addr=\"" + ip + "\"";

                sql_connection.query(sql, function (err, result) { //get dead_time
                    if (err) {
                        console.log('[SELECT ERROR] - ', err.message);
                        return;
                    }
                    if (result[0]['dead_time'] == null) { //if dead_time is null,give it time
                        sql = "UPDATE `account`.`ip_table` SET `dead_time`='" + current_datetime + "' WHERE  `ip_addr`=\"" + ip + "\"";
                        console.log("dead_time is null");
                        sql_connection.query(sql, function (err, result) {
                            if (err) {
                                console.log('[SELECT ERROR] - ', err.message);
                                return;
                            }
                        });
                    }
                    else { //if dead_time not null
                        console.log("dead_time not null");
                        current_datetime = result[0]['dead_time'];



                    }

                    res.status(429);
                    res.set({
                        'Error': '0',
                        'X-RateLimit-Remaining': 0,
                        'X-RateLimit-Reset': current_datetime
                    });
                    res.send('ip block');
                });
            }
            else {//if <999
                res.status(200);
                res.set({
                    'Error': '0',
                    'X-RateLimit-Remaining': 1000 - req_times,
                    'X-RateLimit-Reset': ''
                });
                res.send(ip + "    draw" + req_times + "times");
                sql = "UPDATE `account`.`ip_table` SET `req_times`='" + req_times + "' WHERE  `ip_addr`=\"" + ip + "\"";
                req_times = 1;
                sql_connection.query(sql, function (err, result) { // update req_times
                    if (err) {
                        console.log('[SELECT ERROR] - ', err.message);
                        return;
                    }
                });
            }
        }
    });
});

router.listen(80, function () {
    console.log('app listening on port 80!');
});


