// const validator = require('email-validator');
const validator = require('validator');
const passwordValidator = require('password-validator');
const User = require('../models/user');

module.exports.nameValidation = function nameValidation(obj) {
  try {
    const name = obj.name;
    if (validator.isLength(name, { max: 3 }) && !validator.isEmpty(name)) {
      return { valid: false, msg: 'name is too short' };
    }
    if (validator.isEmpty(name)) {
      return { valid: false, msg: 'name is required' };
    }
    if (!validator.isAlpha(validator.blacklist(name, ' '), ['de-DE'])) {
      return { valid: false, msg: 'name contains invalid characters' };
    }
    return { valid: true, msg: 'name accepted' };
  } catch (error) {
    return { valid: false, msg: 'wrong message format' };
  }
};
module.exports.pwValidation = function pwValidation(obj) {
  try {
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
  } catch (error) {
    return { valid: false, msg: 'wrong message format' };
  }
};
module.exports.emailValidation = async function emailValidation(obj) {
  try {
    const email = obj.email;

    return new Promise(((resolve) => {
    // Do async job
      User.getUserByEmail(email, (err, user) => {
        if (user) {
          resolve({ valid: false, msg: 'email already taken' });
        } else if (!validator.isEmail(email)) {
          resolve({ valid: false, msg: 'email not valid' });
        } else {
          resolve({ valid: true, msg: 'email accepted' });
        }
      });
    }));
  } catch (error) {
    return { valid: false, msg: 'wrong message format' };
  }
};
module.exports.emailValidationOnUpdate = async function emailValidationOnUpdate(obj) {
  try {
    const newEmail = obj.newEmail;
    const oldEmail = obj.oldEmail;
    return new Promise(((resolve) => {
    // Do async job
      User.getUserByEmail(newEmail, (err, user) => {
        if (err) {
          if (!validator.isEmail(newEmail)) {
            resolve({ valid: false, msg: 'email not valid' });
          }
        }
        if (user) {
          if (user.email !== oldEmail) {
            resolve({ valid: false, msg: 'email already taken' });
          } else if (validator.isEmail(newEmail)) {
            resolve({ valid: true, msg: 'email accepted' });
          }
        } else if (!validator.isEmail(newEmail)) {
          resolve({ valid: false, msg: 'email not valid' });
        } else {
          resolve({ valid: true, msg: 'email accepted' });
        }
      });
    }));
  } catch (error) {
    return { valid: false, msg: 'wrong message format' };
  }
};
