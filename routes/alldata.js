var mysql = require('mysql');
var express = require('express');
var router = express();
var sql__query = require('../models/sqlModel');

router.get('/alldata', async function (req, res) {
    var sql = "SELECT * FROM ip_table";
    let sql_res = await sql__query(sql);
    res.send(sql_res);

    sql_res.forEach(element => {
        console.log(element);
    });
});
module.exports = router;
