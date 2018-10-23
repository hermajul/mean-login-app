const express = require('express');
const router = express.Router();
const passport = require('passport');


// welcome to dashboard
router.post('/welcome', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({title:"Dashboard Service", msg:"hello "+req.user.name+ " welcome to your dashboard"});
});

module.exports = router;