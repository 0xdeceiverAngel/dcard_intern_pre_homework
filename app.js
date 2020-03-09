var express = require('express');

var indexRouter = require('./routes/index');
var alldata = require('./routes/alldata');
var draw = require('./routes/draw');

var app = express();

app.get('/', indexRouter);
app.get('/alldata', alldata);
app.get('/draw', draw);

app.listen(80, function () {
  console.log('app listening on port 80!');
});
module.exports = app;
