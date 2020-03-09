var express = require('express');
var router = express.Router();


router.get('/', function (req, res) {
  res.status(200);
  res.set({
      'Error': '0',
      'X-RateLimit-Remaining': '',
      'X-RateLimit-Reset': ''
  });
  var path=__dirname;
  path=path.slice(0,path.length-7); //remove string ->"routes" 
  res.sendFile(path +'/public/index.html');
});

module.exports = router;
