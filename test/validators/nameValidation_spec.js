const expect = require('chai').expect;
const request = require('request');

var nameValidation = {  
    method: 'post',
    json: true,
    url: 'http://localhost:3000/validators/namevalidator'
  };
      describe("Test with valid names", function() {
          it(`1. Valid name`, function () {
            nameValidation.body = { name: 'John Doe' }
              request.post(nameValidation,(err, res, body)=>{
                expect(body).is.deep.equal({ valid: true, msg: 'name accepted' });
              }); 
          }); 
          it(`2. Valid name`, function () {
            nameValidation.body = { name: 'Jane Doe' }
              request.post(nameValidation,(err, res, body)=>{
                expect(body).is.deep.equal({ valid: true, msg: 'name accepted' });
              }); 
          }); 
          it(`3. Valid name`, function () {
            nameValidation.body = { name: 'John' }
              request.post(nameValidation,(err, res, body)=>{
                expect(body).is.deep.equal({ valid: true, msg: 'name accepted' });
              }); 
          }); 
      });

      describe("Test with invalid names", function() {
        it(`1. Invalid name`, function () {
          nameValidation.body = { name: '' }
            request.post(nameValidation,(err, res, body)=>{
              expect(body).is.deep.equal({ valid: false, msg: 'name is required' });
            }); 
        }); 
        it(`2. Invalid name`, function () {
          nameValidation.body = { name: 'Doe' }
            request.post(nameValidation,(err, res, body)=>{
              expect(body).is.deep.equal({ valid: false, msg: 'name is too short' });
            }); 
        }); 
        it(`3. Invalid name`, function () {
          nameValidation.body = { name: 'J@ne D0e' }
            request.post(nameValidation,(err, res, body)=>{
              expect(body).is.deep.equal({ valid: false, msg: 'name contains invalid characters' });
            }); 
        }); 
      });

      describe("Test with invalid messages", function() {
        it(`1. Invalid message`, function () {
          nameValidation.body = { email: 'Jogn Doe' }
            request.post(nameValidation,(err, res, body)=>{
              expect(body).is.deep.equal({ valid: false, msg: 'wrong message format' });
            }); 
        }); 
        it(`2. Invalid message`, function () {
          nameValidation.body = { }
            request.post(nameValidation,(err, res, body)=>{
              expect(body).is.deep.equal({ valid: false, msg: 'wrong message format' });
            }); 
        });  
      });