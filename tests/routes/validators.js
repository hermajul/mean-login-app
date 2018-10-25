const expect = require('chai').expect;
const validators = require('../../scripts/validators');
const request = require("request");

describe('Validators routes', () => {
  describe('Name Validation', () => {
    it('Checks valid names', () => {

        var url = "http://localhost:3000/validators/namevalidator";

        it("return of name validation service", function() {
            request.post(url, {name:'value'} , function(error, response, body) {
                console.log(body);
                expect(false).to.equal(true);
              });
        });
 
    });
   });
});