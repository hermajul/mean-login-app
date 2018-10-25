const expect = require('chai').expect;
const request = require('request');

var emailValidation = {  
  method: 'post',
  json: true,
  url: 'http://localhost:3000/validators/emailvalidator'
};
describe("Test with valid email", function() {
  it(`1. Valid email`, (done) => {
    emailValidation.body = { email: 'John@Doe.de' };
    return request.post(emailValidation,(err, res, body)=>{
      expect(body).is.deep.equal({ valid: true, msg: 'email accepted' });
      done();
    }); 
  }); 
  it(`2. Valid email`, function (done) {
    emailValidation.body = { email: 'Jane@Doe.com' };
    request.post(emailValidation,(err, res, body)=>{
      expect(body).is.deep.equal({ valid: true, msg: 'email accepted' });
      done();
    }); 
  }); 
  it(`3. Valid email`, function (done) {
    emailValidation.body = { email: 'test@test.org' };
    request.post(emailValidation,(err, res, body)=>{
      expect(body).is.deep.equal({ valid: true, msg: 'email accepted' });
      done();
    }); 
  }); 
});

      