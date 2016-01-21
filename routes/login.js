var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/userDetails');

router.get('/', function (req, res) {
    res.render('login',{ registerMsg : ""});
});

// router.get('/register', function(req, res) {
//     res.render('register', { });
// });

router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            console.log(err);
            return res.render('login', { registerMsg : "User Already Exists !!!"});
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

  router.post('/login', passport.authenticate('local'), function(req, res) {
      res.redirect('/home');
  });

  router.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });

  // router.get('/ping', function(req, res){
  //     res.status(200).send("pong!");
  // });

module.exports = router;
