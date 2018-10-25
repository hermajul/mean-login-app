function importTest(name, path) {
    describe(name, function () {
        require(path);
    });
}
const app = require('../app')
describe("Start Mocha Tests", function () {
    before(function (done) {
        
        setTimeout(done, 500);
    });
    after(function () {
      process.exit();      
    });
    //importTest("Email Validation", './validators/emailValidation_spec.js');
    //importTest("Password Validation", './validators/pwValidation_spec.js');
    //importTest("Name Validation", './validators/nameValidation_spec.js');
    //importTest("Signup Validation", './users/signup_spec.js');
    importTest("1. User scenario", './users/case1_spec.js');
    importTest("2. User scenario", './users/case2_spec.js');
    importTest("3. User scenario", './users/case3_spec.js');
    importTest("4. User scenario", './users/case4_spec.js');

});