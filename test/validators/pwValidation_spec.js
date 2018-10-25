const expect = require('chai').expect;
const request = require('request');

var pwValidation = {  
  method: 'post',
  json: true,
  url: 'http://localhost:3000/validators/pwvalidator'
};
describe("Test with valid pw", function() {
  it(`1. Valid pw`, function () {
    pwValidation.body = { pw: "password" };
    request.post(pwValidation,(err, res, body)=>{
      expect(body).is.deep.equal({ valid: true, msg: ['password accepted'] });
    }); 
  }); 
  it(`2. Valid pw`, function () {
    pwValidation.body = { pw: 'test123456' };
    request.post(pwValidation,(err, res, body)=>{
      expect(body).is.deep.equal({ valid: true, msg: ['password accepted'] });
    }); 
  });
});

describe("Test with invalid pw", function() {
  it(`1. Invalid pw`, function () {
    pwValidation.body = { pw: "12345" };
    request.post(pwValidation,(err, res, body)=>{
      expect(body.valid).is.deep.equal(false);
    }); 
  }); 
  it(`2. Invalid pw`, function () {
    pwValidation.body = { pw: 'tes' };
    request.post(pwValidation,(err, res, body)=>{
      expect(body.valid).is.deep.equal(false);
    }); 
  });
});

describe("Test with invalid message", function() {
  it(`1. Invalid message`, function () {
    pwValidation.body = { name: "password" };
    request.post(pwValidation,(err, res, body)=>{
      expect(body).is.deep.equal({ valid: false, msg: 'wrong message format' });
    }); 
  }); 
  it(`2. Invalid message`, function () {
    pwValidation.body = {};
    request.post(pwValidation,(err, res, body)=>{
      expect(body).is.deep.equal({ valid: false, msg: 'wrong message format' });
    }); 
  });
});

      