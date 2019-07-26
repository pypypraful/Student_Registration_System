var express = require('express');
var router = express.Router();

var profile = require('../models/profile');
var user = require('../models/user');


router.get('/update',ensureAuthenticated,function(req, res){
  res.render('update-profile');
});

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('error_msg','You have to logged in first');
    res.redirect('/users/login');
  }
}


router.post('/update',function(req,res){
  var email = req.user.email;
  var name = req.body.name;
  var course_name = req.body.course_name;
  var branch_name  = req.body.branch_name;
  var year = req.body.year;
  var section = req.body.section;
  var university_roll_num = req.body.university_roll_num;
  var address = req.body.address;
  var mobile_num = req.body.mobile_num;

  //Validation
  req.checkBody('name','Student Name is required').notEmpty();
  req.checkBody('course_name','Your Course is required').notEmpty();
  req.checkBody('branch_name','Your Branch is not valid').notEmpty();
  req.checkBody('year','Your Course Year is required').notEmpty();
  req.checkBody('section','Your Class Section is required').notEmpty();
  req.checkBody('university_roll_num','Your University Roll Number cannot be Empty').notEmpty();
  req.checkBody('address','Your Home Address is required').notEmpty();
  req.checkBody('mobile_num','Your Mobile Number is required').notEmpty();

  var errors = req.validationErrors();

  if(errors){
    res.render('update-profile',{
      errors: errors
    });
  } else{
    profile.updateByEmail(email, {
      name : name,
      course_name : course_name,
      branch_name  : branch_name,
      year : year,
      section : section,
      university_roll_num : university_roll_num,
      address : address,
      mobile_num : mobile_num
  },function(err, result){
      if(err) console.log(err);
      else{
        console.log("Successfully updated");
        res.redirect('/myprofile');
      }
    });
  }
});

router.get('/' ,ensureAuthenticated,function(req, res){
   profile.findOne({email:req.user.email}).then((user_profile) => {
     if(user_profile){
     res.render('myprofile',{user_profile:user_profile});
   }
   else{
     user.findOne({email:req.user.email}).then((user_profile) => {
       res.render('myprofile',{user_profile:user_profile});
     },(error)=> {if(error) throw error;});
   }
   },(error) => {
    if(error) throw error;
  });

});

module.exports = router;
