const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { User } = require('../users/models');

const config = require('../config');

const router = express.Router();

const createAuthToken = function (user) {
  return jwt.sign({ user }, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256',
  });
};

const localAuth = passport.authenticate('local', { session: false });
router.use(bodyParser.json());
// The user provides a username and password to login
router.post('/login', localAuth, (req, res) => {
  console.log('this is it');
  console.log(req.body);
  const authToken = createAuthToken(req.user.apiRepr());
  const userInfo = req.user.apiRepr();
  res.json({ authToken, userInfo });
});

router.post('/addWorkout', (req, res) => {
  const { username } = req.body.newWorkout;
  User.findOneAndUpdate(
    { username },
    { $push: { workouts: req.body.newWorkout } },
    (err, docs) => {
      console.log('update error.');
      console.log(err);
      User.findOne({ username }, (error, documents) => {
        const authToken = createAuthToken(documents.apiRepr());
        console.log(authToken);
        console.log(documents.apiRepr());
        res.json({ authToken });
        console.log('find error.');
        console.log(err);
      });
    },
  );
});

router.post('/updateWeight', (req, res) => {
  let updatedWorkout;
  const { username, bodyWeight } = req.body;
  console.log(req.body);
  User.findOne({ username }, (err, docs) => {
    updatedWorkout = Object.assign(
      {},
      docs.workouts[docs.workouts.length - 1],
      { bodyWeight },
    );
    docs.workouts.pop();
    docs.workouts.push(updatedWorkout);
    const updatedWorkouts = docs.workouts;
    User.findOneAndUpdate(
      { username },
      { workouts: updatedWorkouts },
      (error, documents) => {
        User.findOne({ username }, (err, docs) => {
          // res.status(201).send(docs);
          const authToken = createAuthToken(docs.apiRepr());
          res.json({ authToken });
        });
      },
    );
  });
});

router.post('/deleteWorkout', (req, res) => {
  //
  const { logIndex, username } = req.body;
  User.findOne({ username }, (err, docs) => {
    docs.workouts.splice(logIndex, 1);
    const updatedWorkouts = docs.workouts;
    // res.status(201).send(updatedWorkouts);
    User.findOneAndUpdate(
      { username },
      { workouts: updatedWorkouts },
      (error, documents) => {
        User.findOne({ username }, (err, docs) => {
          // res.status(201).send(docs);
          const authToken = createAuthToken(docs.apiRepr());
          res.json({ authToken });
        });
      },
    );
  });
});

router.post('/updateWorkout', (req, res) => {
  //
  const { update, logIndex, username } = req.body;
  // console.log(update);
  // console.log(logIndex);
  // res.sendStatus(201);
  User.findOne({ username }, (err, docs) => {
    const updatedWorkouts = docs.workouts.map((workout, index) => {
      if (index !== Number(logIndex)) {
        return workout;
      }
      return Object.assign({}, workout, update);
    });
    User.findOneAndUpdate(
      { username },
      { workouts: updatedWorkouts },
      (error, documents) => {
        User.findOne({ username }, (err, docs) => {
          // res.status(201).send(docs);
          const authToken = createAuthToken(docs.apiRepr());
          res.json({ authToken });
        });
      },
    );
  });
});

const jwtAuth = passport.authenticate('jwt', { session: false });

// The user exchanges a valid JWT for a new one with a later expiration
router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

module.exports = { router };
