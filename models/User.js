const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name : {
    type : String ,
    required : [true,'Please add a name']
  },
  email : {
    type : String ,
    required : [true , 'Please add an email'] ,
    unique : true ,
    match : [
      // /^\+w([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ,
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ ,
      'Please add a valid email'
    ]
  },
  role : {
    type : String ,
    enum : ['user','publisher'],
    default : 'user'
  },
  password : {
    type : String ,
    required : [true, 'please add a password'],
    minlength : 6 ,
    select : false , // whenever data is sent thru api , this is never returned
  },
  resetPasswordToken : String ,
  resetPasswordExpire : Date ,
  createdAt : {
    type : Date ,
    default : Date.now
  }
});

UserSchema.pre('save',async function(next){
  if(!this.isModified('password')){
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password , salt);
  next();
});

//sign jwt and return
UserSchema.methods.getSignedJwtToken = function(){
  return jwt.sign({ id : this._id } , process.env.JWT_SECRET , {
    expiresIn : process.env.JWT_EXPIRE
  });
};

// match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword , this.password );
}

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function(){
  // generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // hash the token and set to reset
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // set expire 
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000 ;

  return resetToken;
}

module.exports = mongoose.model('User',UserSchema);