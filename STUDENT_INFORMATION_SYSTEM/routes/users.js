var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');
//register
router.get('/register',function(req,res){
  res.render('register');
});

//Login
router.get('/login',function(req, res){
  res.render('login');
});

//register User
router.post('/register',function(req,res){
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var password2 = req.body.password2;

  //Validation
  req.checkBody('name','Name is required').notEmpty();
  req.checkBody('email','E-mail is required').notEmpty();
  req.checkBody('email','E-mail is not valid').isEmail();
  req.checkBody('password','Password is required').notEmpty();
  req.checkBody('password2','Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if(errors){
    res.render('register',{
      errors: errors
    });
  } else{
    var newUser = new User({
      name: name,
      email: email,
      password: password
    });

    User.createUser(newUser, function(err,user){
      if(err) throw err;
      console.log("User created Successfully!!");
    });

    req.flash("success_msg",'You are registered and now you can login');

    res.redirect('/users/Login');
  }
});

passport.use(new LocalStrategy({
  usernameField: 'email',
    passwordField: 'password',
},
  function(username, password, done) {
    User.getUserByEmail(username, function(err, user){
      if(err) throw err;
      if(!user){
        return done(null,false, {message: 'Unknown User'});
      }
      User.comparePassword(password, user.password, function(err,isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null,user);
        } else{
          return done(null, false, {message: 'Invalid Password'});
        }
      });
    });
  }));

passport.serializeUser(function(user,done){
  done(null, user.id);
});
passport.deserializeUser(function(id, done){
  User.getUserById(id, function(err, user){
    done(err, user);
  });
});

router.post('/login',
passport.authenticate('local',{successRedirect:'/myprofile', failureRedirect:'/users/login', failureFlash: true}),
function(req,res){
  console.log('Successfully Logged in');
  res.redirect('/users/login');
});

router.get('/logout', function(req, res){
  req.logout();
  req.flash('success_msg', "You are logged out");
  console.log('Successfully Logged out');
  res.redirect('/users/login');

});


module.exports = router;
