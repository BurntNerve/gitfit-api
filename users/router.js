const express = require('express');
const bodyParser = require('body-parser');

const { User } = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();

// Post to register a new user
router.post('/', jsonParser, (req, res) => {
  console.log(req.body);
  let {
    username,
    password,
    fullName = '',
    currentWeight,
    goalWeight,
  } = req.body;
  // Username and password come in pre-trimmed, otherwise we throw an error
  // before this
  fullName = String(fullName.trim());
  username = String(username.trim());
  password = String(password.trim());
  currentWeight = String(currentWeight.trim());
  goalWeight = String(goalWeight.trim());

  return User.find({ username })
    .count()
    .then(count => {
      if (count > 0) {
        // There is an existing user with the same username
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username',
        });
      }
      return User.hashPassword(password);
    })
    .then(hash =>
      User.create({
        username,
        password: hash,
        fullName,
        currentWeight,
        goalWeight,
      }))
    .then(user => res.status(201).json(user.apiRepr()))
    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      console.log(err);
      res.status(500).json({ code: 500, message: 'Internal server error' });
    });
});

// Never expose all your users like below in a prod application
// we're just doing this so we have a quick way to see
// if we're creating users. keep in mind, you can also
// verify this in the Mongo shell.
router.get('/', (req, res) =>
  User.find()
    .then(users => res.json(users.map(user => user.apiRepr())))
    .catch(err => res.status(500).json({ message: 'Internal server error' })));

module.exports = { router };
