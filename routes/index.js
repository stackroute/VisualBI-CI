var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// app.get('/', function(req, res, next){
//     res.locals.user = req.user || null;
//     res.render('index');
// });

module.exports = router;
