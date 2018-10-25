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

var testUser1 = { name: 'John Doe', email: 'John@Doe.de', password: 'password' };
var testUser2 = { name: 'Jane Doe', email: 'Jane@Doe.de', password: 'passw0rd' };

describe("Test with update user", function() {
  var token;
  it(`1. Valid signup`, function (done) {
    signupValidation.body = testUser1;
    request.post(signupValidation,(err, res, body)=>{
      expect(body).is.deep.equal({ success: true, msg: 'User registered' });
      done();
    }); 
  }); 
  it(`2. Valid signup`, function (done) {
    signupValidation.body = testUser2;
    request.post(signupValidation,(err, res, body)=>{
      expect(body).is.deep.equal({ success: true, msg: 'User registered' });
      done();
    }); 
  }); 
  it(`3. Valid signin to first test account `, function (done) {
    signinValidation.body = testUser1;
    request.post(signinValidation,(err, res, body)=>{
      token = body.token;
      expect(body.success).is.deep.equal(true);
      done();
    }); 
  });
  it(`4. Invalid update of test account with infos of second test account`, function (done) {
    updateValidation.headers =  {'Authorization':token};
    updateValidation.body = testUser2;
    request.post(updateValidation,(err, res, body)=>{
      expect(body.success).is.deep.equal(false);
      done();
    }); 
  });
  it(`5 .Valid delete first test account`, function (done) {
    deleteValidation.headers =  {'Authorization':token};
    request.post(deleteValidation,(err, res, body)=>{
      expect(body).is.deep.equal( {success: true, msg: 'User deleted' });
      done();
    }); 
  });
  it(`6. Valid signin to second test account `, function (done) {
    signinValidation.body = testUser2;
    request.post(signinValidation,(err, res, body)=>{
      token = body.token;
      expect(body.success).is.deep.equal(true);
      done();
    }); 
  });
  it(`5 .Valid delete second test account`, function (done) {
    deleteValidation.headers =  {'Authorization':token};
    request.post(deleteValidation,(err, res, body)=>{
      expect(body).is.deep.equal( {success: true, msg: 'User deleted' });
      done();
    }); 
  });

  
});