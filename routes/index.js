var express = require('express');
var router = express.Router();


router.get('/', function (req, res) {
  res.status(200);
  res.set({
      'Error': '0',
      'X-RateLimit-Remaining': '',
      'X-RateLimit-Reset': ''
  });
  res.send('server on');
});

module.exports = router;
