const util = require('util');
var mysql = require('mysql');
var express = require('express');
var router = express();
var sql__query = require('../models/sqlModel');

// sql_connection.connect();

// console.log(sql_connection);
let ip;
let current_datetime;
let sql;
let req_times;
let sql_result;
router.get('/draw', async function (req, res) {

    ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // console.log(ip);
    sql = `SELECT req_times FROM ip_table  WHERE ip_addr=\"${ip}\"`;  //check ip is in db or not`
    // console.log(sql);

    sql_result = await sql__query(sql);
    // console.log(sql_result[0]);

    if (sql_result[0] == null) {//if ip not in db
        console.log('ip not in db');
        sql = "INSERT INTO `account`.`ip_table` (`ip_addr`, `req_times`, `dead_time`) VALUES (\"" + ip + "\",'1', NULL)";
        req_times = 1;
        sql_result = await sql__query(sql);
        res.status(200);
        res.set({
            'Error': '0',
            'X-RateLimit-Remaining': 1000 - req_times,
            'X-RateLimit-Reset': ''
        });
        res.send(ip + "    " + req_times + "times");
    }

    else {  //if ip in db
        console.log("ip in db");
        req_times = sql_result[0]['req_times'] + 1;
        if (req_times >= 1000) {  //check req_time 
            // if >=1000
            current_datetime = new Date();
            current_datetime.setHours(current_datetime.getHours() + 1 + 8);//+8 是因為時差 
            current_datetime = current_datetime.toISOString().slice(0, 19).replace('T', ' ');
            sql = "UPDATE `account`.`ip_table` SET `req_times`='1000' WHERE  `ip_addr`=\"" + ip + "\"";
            sql_result = await sql__query(sql);
            sql = "SELECT dead_time FROM ip_table  WHERE ip_addr=\"" + ip + "\"";
            sql_result = await sql__query(sql);

            if (sql_result[0]['dead_time'] == null) { //if dead_time is null,give it time
                sql = "UPDATE `account`.`ip_table` SET `dead_time`='" + current_datetime + "' WHERE  `ip_addr`=\"" + ip + "\"";
                console.log("dead_time is null");
                sql_result = await sql__query(sql);
            }
            else { //if dead_time not null
                console.log("dead_time not null");
                current_datetime = sql_result[0]['dead_time'];
            }

            res.status(429);
            res.set({
                'X-RateLimit-Remaining': 0,
                'X-RateLimit-Reset': current_datetime
            });
            res.send('ip block');
        }
        else {//if <999
            res.status(200);
            res.set({
                'X-RateLimit-Remaining': 1000 - req_times,
                'X-RateLimit-Reset': ''
            });
            res.send(ip + "    draw" + req_times + "times");
            sql = "UPDATE `account`.`ip_table` SET `req_times`='" + req_times + "' WHERE  `ip_addr`=\"" + ip + "\"";
            sql_result = await sql__query(sql);
        }
    }
});
module.exports = router;