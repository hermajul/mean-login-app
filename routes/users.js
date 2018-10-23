const express = require('express');

const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const validator = require('email-validator');
const passwordValidator = require('password-validator');
const config = require('../config/config');
const User = require('../models/user');


// register new user
router.post('/signup', (req, res) => {
  const newUser = req.body;
  let responseMsg = [];

  const nameValid = nameValidation({ name: newUser.name });
  const pwValid = pwValidation({ pw: newUser.password });
  let emailValid;
  emailValidation({ email: newUser.email })
    .then(
      (val) => {
        emailValid = val;
        if (!nameValid.valid) {
          responseMsg.push(nameValid.msg);
        }
        if (!emailValid.valid) {
          responseMsg.push(emailValid.msg);
        }
        if (!pwValid.valid) {
          responseMsg = responseMsg.concat(pwValid.msg);
        }
        if (!nameValid.valid || !emailValid.valid || !pwValid.valid) {
          return res.json({ success: false, msg: responseMsg });
        }
        User.addUser(newUser, (err) => {
          if (err) {
            return res.json({ success: false, msg: 'Failed to register user' });
          }
          return res.json({ success: true, msg: 'User registered' });
        });
      },() => {
        res.json({ success: false, msg: 'err' });
      }
    )
});

// update user info
router.post('/update', passport.authenticate('jwt', { session: false }), (req, res) => {
  const oldUser = req.user;
  const newUser = req.body;
  let responseMsg = [];

  const nameValid = nameValidation({ name: newUser.name });
  const pwValid = pwValidation({ pw: newUser.password });
  let emailValid;
  emailValidationOnUpdate({ newEmail: newUser.email, oldEmail: oldUser.email })
    .then(
      (val) => {
        emailValid = val;
        if (!nameValid.valid) {
          responseMsg.push(nameValid.msg);
        }
        if (!emailValid.valid) {
          responseMsg.push(emailValid.msg);
        }
        if (!pwValid.valid) {
          responseMsg = responseMsg.concat(pwValid.msg);
        }
        if (!nameValid.valid || !emailValid.valid || !pwValid.valid) {
          return res.json({ success: false, msg: responseMsg });
        }

        User.updateUser(newUser, oldUser, (err) => {
          if (err) {
            res.json({ success: false, msg: 'Failed to update user' });
          }else{
            res.json({ success: true, msg: 'User updated' });
          }
        });
        //return res.json({ success: false, msg: 'err' });
      },() => {
          res.json({ success: false, msg: 'err' });
      });
});

// Authenticate and return token
router.post('/signin', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.getUserByEmail(email, (err, user) => {
    if (err) {
      return res.json({ success: false, msg: 'Error' });
    }
    if (!user) {
      return res.json({ success: false, msg: 'Email not registered' });
    }
    User.comparePassword(password, user.password, (error, isMatch) => {
      if (error) {
        return res.json({ success: false, msg: 'Error' });
      }
      if (isMatch) {
        const token = jwt.sign({ data: user }, config.secret, {
          expiresIn: 604800, // 1 week
        });
        return res.json({
          success: true,
          token: `JWT ${token}`,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
        });
      }
      return res.json({ success: false, msg: 'Wrong password' });
    });
  });
});

// return Profile Info
router.post('/getprofile', passport.authenticate('jwt', { session: false }), (req, res) => {
  // console.log(req)
  res.json({ user: req.user });
});

// delete user
router.post('/delete', (req, res) => {
  User.deleteUser(req.user, (err) => {
    if (err) {
      res.json({ success: false, msg: 'Failed to delete user' });
    } else {
      res.json({ success: true, msg: 'User deleted' });
    }
  });
});

// name Validator
router.post('/namevalidator', (req, res) => {
  const name = req.body;
  res.json(nameValidation(name));
});
// email Validator
router.post('/emailvalidator', (req, res) => {
  const email = req.body;
  const p1 = emailValidation(email);
  p1.then(
    (val) => {
      res.json(val);
    },
    () => {
    },
  );
});
// email Validator
router.post('/emailonupdatevalidator', (req, res) => {
  const email = req.body;
  const p1 = emailValidationOnUpdate(email);
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
  res.json(pwValidation(pw));
});


module.exports = router;

function nameValidation(obj) {
  const name = obj.name;
  if (name.length < 4) {
    return { valid: false, msg: 'name is too short' };
  }
  return { valid: true, msg: 'name accepted' };
}
function pwValidation(obj) {
  const pw = obj.pw;

  const schema = new passwordValidator();
  schema
    .is().min(4)
    .has().lowercase()
    .has()
    .not()
    .spaces();
  // .has().symbols()

  const use = ["pw invalid, make sure it's: "];

  const min = schema.properties.find(elem => elem.method === 'min');
  if (min) {
    use.push(`at least ${min.arguments['0']} characters `);
  }
  const max = schema.properties.find(elem => elem.method === 'max');
  if (max) {
    use.push(`not more than ${max.arguments['0']} characters`);
  }
  for (let index = 0; index < schema.properties.length - 1; index++) {
    if (schema.properties[index].method === 'has') {
      if (schema.properties[index + 1].method !== 'not') {
        use.push(`has ${schema.properties[index + 1].method}`);
      }
    }
  }
  for (let index = 0; index < schema.properties.length - 2; index++) {
    if (schema.properties[index].method === 'has') {
      if (schema.properties[index + 1].method === 'not') {
        use.push(`has no ${schema.properties[index + 2].method}`);
      }
    }
  }

  if (!schema.validate(pw)) {
    return { valid: false, msg: use };
  }
  return { valid: true, msg: ['password accepted'] };
}
async function emailValidation(obj) {
  const email = obj.email;

  return new Promise(((resolve, reject) => {
    // Do async job
    User.getUserByEmail(email, (err, user) => {
      if (err) reject(err);
      if (user) {
        resolve({ valid: false, msg: 'email already taken' });
      } else if (!validator.validate(email)) {
        resolve({ valid: false, msg: 'email not valid' });
      } else {
        resolve({ valid: true, msg: 'email accepted' });
      }
    });
  }));
}
async function emailValidationOnUpdate(obj) {
  const newEmail = obj.newEmail;
  const oldEmail = obj.oldEmail;
  return new Promise(((resolve) => {
    // Do async job
    User.getUserByEmail(newEmail, (err, user) => {
      if (err) {
        if (!validator.validate(newEmail)) {
          resolve({ valid: false, msg: 'email not valid' });
        }
      }
      if (user) {
        if (user.email != oldEmail) {
          resolve({ valid: false, msg: 'email already taken' });
        } else if (validator.validate(newEmail)) {
          
          resolve({ valid: true, msg: 'email accepted' });
        }
      } else if (!validator.validate(newEmail)) {
        resolve({ valid: false, msg: 'email not valid' });
      } else {
        resolve({ valid: true, msg: 'email accepted' });
      }
    });
  }));
}
