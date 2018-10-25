const expect = require('chai').expect;
const request = require('request');

var signupValidation = {  
  method: 'post',
  json: true,
  url: 'http://localhost:3000/users/signup'
};
var signinValidation = {  
  method: 'post',
  json: true,
  url: 'http://localhost:3000/users/signin'
};
var updateValidation = {  
  method: 'post',
  json: true,
  url: 'http://localhost:3000/users/update'
};
var deleteValidation = {  
  method: 'post',
  json: true,
  url: 'http://localhost:3000/users/delete'
};

var testUser = { name: 'John Doe', email: 'John@Doe.de', password: 'password' };

describe("Test with update user", function() {
  var token;
  it(`1. Valid signup`, function (done) {
    signupValidation.body = testUser;
    request.post(signupValidation,(err, res, body)=>{
      expect(body).is.deep.equal({ success: true, msg: 'User registered' });
      done();
    }); 
  }); 
  it(`2. Valid signin to test account `, function (done) {
    signinValidation.body = testUser
    request.post(signinValidation,(err, res, body)=>{
      token = body.token;
      expect(body.success).is.deep.equal(true);
      done();
    }); 
  });
  it(`5 .Valid update test account`, function (done) {
    updateValidation.headers =  {'Authorization':token};
    testUser.name = 'Jane'
    updateValidation.body = testUser;
    request.post(updateValidation,(err, res, body)=>{
      expect(body).is.deep.equal( { success: true, msg: 'User updated' });
      done();
    }); 
  });
  it(`5 .Valid delete test account`, function (done) {
    deleteValidation.headers =  {'Authorization':token};
    deleteValidation.body = testUser;
    request.post(deleteValidation,(err, res, body)=>{
      expect(body).is.deep.equal( {success: true, msg: 'User deleted' });
      done();
    }); 
  });

  
});