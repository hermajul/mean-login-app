const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/user');

const validator = require("email-validator");
const passwordValidator = require('password-validator');

// register new user
router.post('/signup', (req, res, next) => {
  var newuser = req.body;
  var responseMsg = [];

  var nameValid   = nameValidation({name:newuser.name});
  var pwValid     = pwValidation({pw:newuser.password});
  var emailValid  ;
  emailValidation({email:newuser.email})
  .then(
    function(val) {
      emailValid = val;
      if( !nameValid.valid ){
        responseMsg.push(nameValid.msg);
      }
      if( !emailValid.valid ){
        responseMsg.push(emailValid.msg);
      }
      if( !pwValid.valid ){
        responseMsg= responseMsg.concat(pwValid.msg);
      }
      if(!nameValid.valid || !emailValid.valid || !pwValid.valid){
        return res.json({success: false, msg: responseMsg});
      }else{
          User.addUser(newuser, (err, user) => {
            if(err) {
              res.json({success: false, msg: 'Failed to register user'});
            } else {
              res.json({success: true, msg: 'User registered'});
            }
          });
        }
    },
    function(err) {
      return res.json({success: false, msg: "err"});
    }
  )  
});

// update user info
router.post('/update', passport.authenticate('jwt', {session:false}), (req, res, next) => {

  var olduser = req.user;
  var newuser = req.body;
  newuser._id = olduser._id;
  console.log(newuser);
  var responseMsg = [];

  var nameValid   = nameValidation({name:newuser.name});
  var pwValid     = pwValidation({pw:newuser.password});
  var emailValid  ;
  emailValidationOnUpdate({email:newuser.email,id:olduser._id})
  .then(
    function(val) {
      emailValid = val;
      console.log(!nameValid.valid +" "+ !emailValid.valid +" "+ !pwValid.valid);
      if( !nameValid.valid ){
        responseMsg.push(nameValid.msg);
      }
      if( !emailValid.valid ){
        responseMsg.push(emailValid.msg);
      }
      if( !pwValid.valid ){
        responseMsg= responseMsg.concat(pwValid.msg);
      }
      if(!nameValid.valid || !emailValid.valid || !pwValid.valid){
        return res.json({success: false, msg: responseMsg});
      }else{
        
        User.updateUser(newuser, (err, user) => {
          if(err) {
            res.json({success: false, msg: 'Failed to update user'});
          } else {
            res.json({success: true, msg: 'User updated'});
          }
        });
      }
    },
    function(err) {
      return res.json({success: false, msg: "err"});
    }
  )
});

// Authenticate and return token
router.post('/signin', (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;

  User.getUserByEmail(email, (err, user) => {
    if(err) throw err;
    if(!user) {
      return res.json({success: false, msg: 'Email not registered'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch) {
        const token = jwt.sign({data: user}, config.secret, {
          expiresIn: 604800 // 1 week
        });
        res.json({
          success: true,
          token: 'JWT '+token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email
          }
        })
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});

// return Profile Info
router.post('/getprofile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  //console.log(req)
  res.json({user: req.user});
});

// delete user
router.post('/delete', (req, res, next) => {

  User.deleteUser(req.user, (err, user) => {
    if(err) {
      res.json({success: false, msg: 'Failed to delete user'});
    } else {
      res.json({success: true, msg: 'User deleted'});
    }
  });
});

// name Validator
router.post('/namevalidator', (req, res, next) => {
  var name = req.body;
  res.json(nameValidation(name));
});
// email Validator
router.post('/emailvalidator', (req, res, next) => {
  var email = req.body;
  var p1 = emailValidation(email);
  p1.then(
    function(val) {
      res.json(val)
    },
    function(err) {
      //console.log(err);
    }
  )
});
// email Validator
router.post('/emailonupdatevalidator', (req, res, next) => {
  var email = req.body;
  var p1 = emailValidationOnUpdate(email);
  p1.then(
    function(val) {
      res.json(val)
    },
    function(err) {
      //console.log(err);
    }
  )
});
// pw Validator
router.post('/pwvalidator', (req, res, next) => {
  var pw = req.body;
  res.json(pwValidation(pw));
});


module.exports = router;

function nameValidation(obj){
  var name = obj.name;
  if(name.length < 4){
    return {valid:false , msg:"name is too short"};
  }else{
    return {valid:true , msg:"name accepted"};
  }
}
function pwValidation(obj){
  var pw = obj.pw;
 
  var schema = new passwordValidator(); 
  schema
  .is().min(4)                                                              
  .has().lowercase()                              
  .has().not().spaces()
  //.has().symbols()

  var use = ["pw invalid, make sure it's: "]

  var min = schema.properties.find(function (elem) {return elem.method == 'min';});
  if(min){
    use.push("at least "+ min.arguments['0']+ " characters ")
  }
  var max = schema.properties.find(function (elem) {return elem.method == 'max';});
  if(max){
    use.push("not more than " + max.arguments['0'] + " characters");
  }
  for (let index = 0; index < schema.properties.length -1; index++) {
      if(schema.properties[index].method == 'has'){
        if(schema.properties[index+1].method != 'not'){
          use.push("has " + schema.properties[index+1].method);
        }
      }    
  }
  for (let index = 0; index < schema.properties.length - 2; index++) {
    if(schema.properties[index].method == 'has'){
      if(schema.properties[index+1].method == 'not'){
        use.push("has no " + schema.properties[index+2].method);
      }
    }    
  }

  if(!schema.validate(pw)){
    return {valid:false , msg:use};
  }else{
    return {valid:true , msg:["password accepted"]};
  }
}
async function emailValidation(obj){
  var email = obj.email;

    return new Promise(function(resolve, reject) {
    	// Do async job
      User.getUserByEmail(email, (err, user) => {
      
        if(err) reject(err);
        if(user) {
            resolve({valid:false , msg:"email already taken"});
        }else{
          if(!validator.validate(email)){
            resolve({valid:false , msg:"email not valid"});
          }else{
            resolve({valid:true , msg:"email accepted"});
          }          
        }
      })
    });
}
async function emailValidationOnUpdate(obj){
  var email = obj.email;
  var id    = obj.id;
    return new Promise(function(resolve, reject) {
      // Do async job
      User.getUserByEmail(email, (err, user) => {
      
        if(err){
          if(!validator.validate(email)){
            resolve({valid:false , msg:"email not valid"});                    
          }
        }
        if(user) {
          if(!user._id.equals(id)){
            resolve({valid:false , msg:"email already taken"});
          }else if(validator.validate(email)){
            resolve({valid:true , msg:"email accepted"});
          }
        }else if(!validator.validate(email)){
          resolve({valid:false , msg:"email not valid"});         
        }else{
          resolve({valid:true , msg:"email accepted"});
        }
      })
    });
}

