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

describe("Test with invalid Signin", function() {
  it(`1. Valid signup`, function (done) {
    signupValidation.body = testUser;
    request.post(signupValidation,(err, res, body)=>{
      expect(body).is.deep.equal({ success: true, msg: 'User registered' });
      done();
    }); 
  }); 
  it(`2. Invalid signin wrong email`, function (done) {
    signinValidation.body = testUser;
    signinValidation.body.email = 'wrong@email.address';
    request.post(signinValidation,(err, res, body)=>{
      expect(body).is.deep.equal({ success: false, msg: 'Email not registered' });
      done();
    }); 
  });
  it(`3. Invalid signin wrong password`, function (done) {
    signinValidation.body = testUser;
    signinValidation.body.email = 'John@Doe.de';
    signinValidation.body.password = "wrongpassword"
    request.post(signinValidation,(err, res, body)=>{
      expect(body).is.deep.equal({ success: false, msg: 'Wrong password' });
      done();
    }); 
  });
  var token;
  it(`4. Valid signin to test account `, function (done) {
    signinValidation.body = testUser
    signinValidation.body.password = "password"
    request.post(signinValidation,(err, res, body)=>{
      token = body.token;
      expect(body.success).is.deep.equal(true);
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