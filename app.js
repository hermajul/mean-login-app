const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.set('useFindAndModify', false);
const config = require('./config/config');

mongoose.connect(config.db, { useNewUrlParser: true });
mongoose.connection.on('connected', () => {
  console.info(`Connected to Database: ${config.db}`);
});
mongoose.connection.on('error', (err) => {
  console.error(`Error on Databaseconnection: ${err}`);
});

const app = express();

// Routes
const users = require('./routes/users');
const validators = require('./routes/validators');
const dashboard = require('./routes/dashboard');
// Port
const port = (process.env.PORT || 3000);


// Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

// Authentication with passportjs
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.use('/users', users);
app.use('/dashboard', dashboard);
app.use('/validators', validators);


// Index
app.get('/', (req, res) => {
  res.send('invaild endpoint');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Server start on port
app.listen(port, () => {
  console.info(`Server started on port ${port}`);
});

module.exports = app;
