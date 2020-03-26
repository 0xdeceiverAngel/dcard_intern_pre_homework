var express = require('express');

var alldata = require('./routes/alldata');
var draw = require('./routes/draw');

var app = express();

app.get('/', express.static('public'));
app.get('/alldata', alldata);
app.get('/draw', draw);

app.listen(5000, function () {
  console.log('app listening on port 5000!');
});
module.exports = app;
