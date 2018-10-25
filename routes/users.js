const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/user');
const validators = require('../scripts/validators');

// register new user
router.post('/signup', (req, res) => {
  const newUser = req.body;
  let responseMsg = [];

  const nameValid = validators.nameValidation({ name: newUser.name });
  const pwValid = validators.pwValidation({ pw: newUser.password });
  let emailValid;
  validators.emailValidation({ email: newUser.email })
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
        return null;
      }, () => res.json({ success: false, msg: 'err' }),
    );
});

// update user info
router.post('/update', passport.authenticate('jwt', { session: false }), (req, res) => {
  const oldUser = req.user;
  const newUser = req.body;
  let responseMsg = [];

  const nameValid = validators.nameValidation({ name: newUser.name });
  const pwValid = validators.pwValidation({ pw: newUser.password });
  let emailValid;
  validators.emailValidationOnUpdate({ newEmail: newUser.email, oldEmail: oldUser.email })
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
            return res.json({ success: false, msg: 'Failed to update user' });
          }
          return res.json({ success: true, msg: 'User updated' });
        });
        return null;
      }, () => {
        res.json({ success: false, msg: 'err' });
      },
    );
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
    return null;
  });
});

// return Profile Info
router.post('/getprofile', passport.authenticate('jwt', { session: false }), (req, res) => {
  // console.log(req)
  res.json({ user: req.user });
});

// delete user
router.post('/delete', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.deleteUser(req.user, (err) => {
    if (err) {
      res.json({ success: false, msg: 'Failed to delete user' });
    } else {
      res.json({ success: true, msg: 'User deleted' });
    }
  });
});

module.exports = router;
