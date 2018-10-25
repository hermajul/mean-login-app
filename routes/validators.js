const express = require('express');
const router = express.Router();
const validators = require('../scripts/validators');


// name Validator
router.post('/namevalidator', (req, res) => {
  const name = req.body;
  res.json(validators.nameValidation(name));
});
// email Validator
router.post('/emailvalidator', (req, res) => {
  const email = req.body;
  const p1 = validators.emailValidation(email);
  p1.then(
    val => res.json(val),
    () => {
    },
  );
});
// email Validator
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
// pw Validator
router.post('/pwvalidator', (req, res) => {
  const pw = req.body;
  res.json(validators.pwValidation(pw));
});


module.exports = router;
