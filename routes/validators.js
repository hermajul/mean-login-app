const express = require('express');
const router = express.Router();
const validators = require('../scripts/validators');


/**
* This function checks the submitted name for the following criteria:
* - length of the name is minium 4 charaters
* - only letters are accepted
*
* @api {post} /validators/namevalidator
* @apiName validators
* @apiHeader (header) {String} Content-Type 'application/json'.
* @apiParam {JSON} body { name: 'John Doe' }
* @apiSuccess {JSON} body When message is valid returns one of the following:
* { valid: true, msg: 'name accepted' }
* { valid: false, msg: 'name is too short' }
* { valid: false, msg: 'name is required' }
* { valid: false, msg: 'name contains invalid characters' }
* { valid: false, msg: 'wrong message format' }
*/
router.post('/namevalidator', (req, res) => {
  const name = req.body;
  res.json(validators.nameValidation(name));
});

/**
* This function checks if the submitted email is a valid and not used
*
* @api {post} /validators/emailvalidator
* @apiName validators
* @apiHeader (header) {String} Content-Type 'application/json'.
* @apiParam {JSON} body {email:'John@Doe.de'}
* @apiSuccess {JSON} body When message is valid returns:
*     { valid: true, msg: 'email accepted' }
*     { valid: false, msg: 'email already taken' }
*     { valid: false, msg: 'email not valid' }
*     { valid: false, msg: 'wrong message format' }
*/
router.post('/emailvalidator', (req, res) => {
  const email = req.body;
  const p1 = validators.emailValidation(email);
  p1.then(
    val => res.json(val),
    () => {
    },
  );
});

/**
* This function checks if the submitted email is a valid and not used
* (only for the user update)
*
* @api {post} /validators/emailonupdatevalidator
* @apiName validators
* @apiHeader (header) {String} Content-Type 'application/json'.
* @apiParam {JSON} body {email:'John@Doe.de'}
* @apiSuccess {JSON} body When message is valid returns:
*     { valid: true, msg: 'email accepted' }
*     { valid: false, msg: 'email already taken' }
*     { valid: false, msg: 'email not valid' }
*     { valid: false, msg: 'wrong message format' }
*/
router.post('/emailonupdatevalidator', (req, res) => {
  const email = req.body;
  const p1 = validators.emailValidationOnUpdate(email);
  p1.then(
    (val) => {
      res.json(val);
    },
    () => {
    },
  );
});

/**
* This function checks if the submitted password is a valid
*
* @api {post} /validators/pwvalidator
* @apiName validators
* @apiHeader (header) {String} Content-Type 'application/json'.
* @apiParam {JSON} body {pw:'passw0rt'}
* @apiSuccess {JSON} body When message is valid returns:
*     { valid: true, msg: ['password accepted'] }
*     { valid: false, msg: ['reason1','reason2',...] }
*     { valid: false, msg: 'wrong message format' }
*/
router.post('/pwvalidator', (req, res) => {
  const pw = req.body;
  res.json(validators.pwValidation(pw));
});


module.exports = router;
