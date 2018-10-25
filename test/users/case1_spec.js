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

var deleteValidation = {  
  method: 'post',
  json: true,
  url: 'http://localhost:3000/users/delete'
};

var testUser = { name: 'John Doe', email: 'John@Doe.de', password: 'password' };

describe("Signup with valid user, signin and delete", function() {
  it(`1. Valid signup`, function (done) {
    signupValidation.body = testUser;
    request.post(signupValidation,(err, res, body)=>{
      expect(body).is.deep.equal({ success: true, msg: 'User registered' });
      done();
    }); 
  }); 
  var token;
  it(`2. Valid signin`, function (done) {
    signinValidation.body = testUser
    request.post(signinValidation,(err, res, body)=>{
      token = body.token;
      expect(body.success).is.deep.equal(true);
      done();
    }); 
  });
  it(`3 .Valid delete`, function (done) {
    deleteValidation.headers =  {'Authorization':token};
    deleteValidation.body = testUser;
    request.post(deleteValidation,(err, res, body)=>{
      expect(body).is.deep.equal({success: true, msg: 'User deleted' });
      done();
    }); 
  });
  
  
  
});