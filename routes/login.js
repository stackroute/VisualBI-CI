var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/userDetails');

router.post('/getUserId', function (req, res) {
    var uName = req.body.username;
    Account.findOne({username : uName}, function(err, user){
      if(!err){
        res.json(user._id);
      }else{
        console.log(err);
        res.json({"status":"error", "error":err});
      }
    });
});

router.get('/', function (req, res) {
    res.render('login',{ registerMsg : ""});
});

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

module.exports = router;
