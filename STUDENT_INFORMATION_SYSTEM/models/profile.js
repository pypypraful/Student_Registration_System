var mongoose = require('mongoose');

//Profile Schema
var ProfileSchema = mongoose.Schema({
  email:{
    type: String
  },
  name:{
    type: String
  },
  course_name:{
    type:String
  },
  branch_name:{
    type:String
  },
  year:{
    type:String
  },
  section:{
    type:String
  },
  university_roll_num:{
    type:String
  },
  address:{
    type:String
  },
  mobile_num:{
    type:String
  }
});

var Profile = module.exports = mongoose.model('Profile', ProfileSchema);


//Method for updating profile searched by email
module.exports.updateByEmail = function(email, query, callback){
  Profile.findOneAndUpdate({email:email},{$set:query},{upsert:true}, function(err,user){
    if(err) console.log(err);
    callback(null, user);
  });
}
