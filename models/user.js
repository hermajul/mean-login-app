const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const UserSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model('User', UserSchema);
const User = module.exports;

module.exports.getUserById = function getUserById(id, callback) {
  User.findById(id, callback);
};
module.exports.getUserByEmail = function getUserByEmail(email, callback) {
  const query = { email };
  User.findOne(query, callback);
};
module.exports.addUser = function addUser(newUser, callback) {
  const user = new User(newUser);
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (error, hash) => {
      if (error) throw error;
      user.password = hash;
      user.save(callback);
    });
  });
};
module.exports.updateUser = function updateUser(newuser, olduser, callback) {
  var user = newuser;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (error, hash) => {
      if (error) throw error;
      user.password = hash;
      User.findOneAndUpdate({ email: olduser.email }, user, callback);
    });
  });
};
module.exports.deleteUser = function deleteUser(user, callback) {
  User.findByIdAndRemove(user._id, callback);
};
module.exports.comparePassword = function comparePassword(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
};
