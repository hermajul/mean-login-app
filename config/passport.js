const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('./config');

module.exports = function(passport) {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, (token, done) => {
    User.getUserById(token.data._id, (err, user) => {
      if(err) {
        console.log(err);
        return done(err, false);
      }
      if(user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }));
}
