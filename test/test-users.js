global.DATABASE_URL = 'mongodb://localhost/jwt-auth-demo-test';
const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');
const { User } = require('../users');

const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('/api/user', () => {
  const username = 'exampleUser';
  const password = 'examplePass';
  const fullName = 'example name';
  const currentWeight = '175';
  const goalWeight = '190';
  const workouts = [];
  const usernameB = 'exampleUserB';
  const passwordB = 'examplePassB';
  const fullNameB = 'example nameB';
  const currentWeightB = '139';
  const goalWeightB = '121';
  const workoutsB = [];

  before(() => runServer());

  after(() => closeServer());

  beforeEach(() => {});

  afterEach(() => User.remove({}));

  describe('/api/users', () => {
    describe('POST', () => {
      // it('Should reject users with missing username', () =>
      //   chai
      //     .request(app)
      //     .post('/api/users')
      //     .send({
      //       password,
      //       fullName,
      //       currentWeight,
      //       goalWeight,
      //     })
      //     .then(() => expect.fail(null, null, 'Request should not succeed'))
      //     .catch(err => {
      //       if (err instanceof chai.AssertionError) {
      //         throw err;
      //       }
      //
      //       const res = err.response;
      //       expect(res).to.have.status(422);
      //       expect(res.body.reason).to.equal('ValidationError');
      //       expect(res.body.message).to.equal('Missing field');
      //       expect(res.body.location).to.equal('username');
      //     }));
      // it('Should reject users with missing password', () =>
      //   chai
      //     .request(app)
      //     .post('/api/users')
      //     .send({
      //       username,
      //       fullName,
      //       currentWeight,
      //       goalWeight,
      //     })
      //     .then(() => expect.fail(null, null, 'Request should not succeed'))
      //     .catch(err => {
      //       if (err instanceof chai.AssertionError) {
      //         throw err;
      //       }
      //
      //       const res = err.response;
      //       expect(res).to.have.status(422);
      //       expect(res.body.reason).to.equal('ValidationError');
      //       expect(res.body.message).to.equal('Missing field');
      //       expect(res.body.location).to.equal('password');
      //     }));
      // it('Should reject users with non-string username', () =>
      //   chai
      //     .request(app)
      //     .post('/api/users')
      //     .send({
      //       username: 1234,
      //       password,
      //       fullName,
      //       currentWeight,
      //       goalWeight,
      //     })
      //     .then(() => expect.fail(null, null, 'Request should not succeed'))
      //     .catch(err => {
      //       if (err instanceof chai.AssertionError) {
      //         throw err;
      //       }
      //
      //       const res = err.response;
      //       expect(res).to.have.status(422);
      //       expect(res.body.reason).to.equal('ValidationError');
      //       expect(res.body.message).to.equal('Incorrect field type: expected string');
      //       expect(res.body.location).to.equal('username');
      //     }));
      // it('Should reject users with non-string password', () =>
      //   chai
      //     .request(app)
      //     .post('/api/users')
      //     .send({
      //       username,
      //       password: 1234,
      //       fullName,
      //       currentWeight,
      //       goalWeight,
      //     })
      //     .then(() => expect.fail(null, null, 'Request should not succeed'))
      //     .catch(err => {
      //       if (err instanceof chai.AssertionError) {
      //         throw err;
      //       }
      //
      //       const res = err.response;
      //       expect(res).to.have.status(422);
      //       expect(res.body.reason).to.equal('ValidationError');
      //       expect(res.body.message).to.equal('Incorrect field type: expected string');
      //       expect(res.body.location).to.equal('password');
      //     }));
      // it('Should reject users with non-string full name', () =>
      //   chai
      //     .request(app)
      //     .post('/api/users')
      //     .send({
      //       username,
      //       password,
      //       fullName: 1234,
      //       currentWeight,
      //       goalWeight,
      //     })
      //     .then(() => expect.fail(null, null, 'Request should not succeed'))
      //     .catch(err => {
      //       if (err instanceof chai.AssertionError) {
      //         throw err;
      //       }
      //
      //       const res = err.response;
      //       expect(res).to.have.status(422);
      //       expect(res.body.reason).to.equal('ValidationError');
      //       expect(res.body.message).to.equal('Incorrect field type: expected string');
      //       expect(res.body.location).to.equal('firstName');
      //     }));
      // it('Should reject users with non-string last name', () =>
      //   chai
      //     .request(app)
      //     .post('/api/users')
      //     .send({
      //       username,
      //       password,
      //       firstName,
      //       lastName: 1234,
      //     })
      //     .then(() => expect.fail(null, null, 'Request should not succeed'))
      //     .catch(err => {
      //       if (err instanceof chai.AssertionError) {
      //         throw err;
      //       }
      //
      //       const res = err.response;
      //       expect(res).to.have.status(422);
      //       expect(res.body.reason).to.equal('ValidationError');
      //       expect(res.body.message).to.equal('Incorrect field type: expected string');
      //       expect(res.body.location).to.equal('lastName');
      //     }));
      // it('Should reject users with non-trimmed username', () =>
      //   chai
      //     .request(app)
      //     .post('/api/users')
      //     .send({
      //       username: ` ${username} `,
      //       password,
      //       fullName,
      //       currentWeight,
      //       goalWeight,
      //     })
      //     .then(() => expect.fail(null, null, 'Request should not succeed'))
      //     .catch(err => {
      //       if (err instanceof chai.AssertionError) {
      //         throw err;
      //       }
      //
      //       const res = err.response;
      //       expect(res).to.have.status(422);
      //       expect(res.body.reason).to.equal('ValidationError');
      //       expect(res.body.message).to.equal('Cannot start or end with whitespace');
      //       expect(res.body.location).to.equal('username');
      //     }));
      // it('Should reject users with non-trimmed password', () =>
      //   chai
      //     .request(app)
      //     .post('/api/users')
      //     .send({
      //       username,
      //       password: ` ${password} `,
      //       fullName,
      //       currentWeight,
      //       goalWeight,
      //     })
      //     .then(() => expect.fail(null, null, 'Request should not succeed'))
      //     .catch(err => {
      //       if (err instanceof chai.AssertionError) {
      //         throw err;
      //       }
      //
      //       const res = err.response;
      //       expect(res).to.have.status(422);
      //       expect(res.body.reason).to.equal('ValidationError');
      //       expect(res.body.message).to.equal('Cannot start or end with whitespace');
      //       expect(res.body.location).to.equal('password');
      //     }));
      // it('Should reject users with empty username', () =>
      //   chai
      //     .request(app)
      //     .post('/api/users')
      //     .send({
      //       username: '',
      //       password,
      //       fullName,
      //       currentWeight,
      //       goalWeight,
      //     })
      //     .then(() => expect.fail(null, null, 'Request should not succeed'))
      //     .catch(err => {
      //       if (err instanceof chai.AssertionError) {
      //         throw err;
      //       }
      //
      //       const res = err.response;
      //       expect(res).to.have.status(422);
      //       expect(res.body.reason).to.equal('ValidationError');
      //       expect(res.body.message).to.equal('Must be at least 1 characters long');
      //       expect(res.body.location).to.equal('username');
      //     }));
      // it('Should reject users with password less than ten characters', () =>
      //   chai
      //     .request(app)
      //     .post('/api/users')
      //     .send({
      //       username,
      //       password: '123456789',
      //       fullName,
      //       currentWeight,
      //       goalWeight,
      //     })
      //     .then(() => expect.fail(null, null, 'Request should not succeed'))
      //     .catch(err => {
      //       if (err instanceof chai.AssertionError) {
      //         throw err;
      //       }
      //
      //       const res = err.response;
      //       expect(res).to.have.status(422);
      //       expect(res.body.reason).to.equal('ValidationError');
      //       expect(res.body.message).to.equal('Must be at least 10 characters long');
      //       expect(res.body.location).to.equal('password');
      //     }));
      // it('Should reject users with password greater than 72 characters', () =>
      //   chai
      //     .request(app)
      //     .post('/api/users')
      //     .send({
      //       username,
      //       password: new Array(73).fill('a').join(''),
      //       fullName,
      //       currentWeight,
      //       goalWeight,
      //     })
      //     .then(() => expect.fail(null, null, 'Request should not succeed'))
      //     .catch(err => {
      //       if (err instanceof chai.AssertionError) {
      //         throw err;
      //       }
      //
      //       const res = err.response;
      //       expect(res).to.have.status(422);
      //       expect(res.body.reason).to.equal('ValidationError');
      //       expect(res.body.message).to.equal('Must be at most 72 characters long');
      //       expect(res.body.location).to.equal('password');
      //     }));
      it('Should reject users with duplicate username', () =>
        // Create an initial user
        User.create({
          username,
          password,
          fullName,
          currentWeight,
          goalWeight,
        })
          .then(() =>
            // Try to create a second user with the same username
            chai
              .request(app)
              .post('/api/users')
              .send({
                username,
                password,
                fullName,
                currentWeight,
                goalWeight,
              }))
          .then(() => expect.fail(null, null, 'Request should not succeed'))
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Username already taken');
            expect(res.body.location).to.equal('username');
          }));
      it('Should create a new user', () =>
        chai
          .request(app)
          .post('/api/users')
          .send({
            username,
            password,
            fullName,
            currentWeight,
            goalWeight,
          })
          .then(res => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys(
              'username',
              'fullName',
              'currentWeight',
              'goalWeight',
              'workouts',
            );
            expect(res.body.username).to.equal(username);
            expect(res.body.fullName).to.equal(fullName);
            expect(res.body.currentWeight).to.equal(currentWeight);
            expect(res.body.goalWeight).to.equal(goalWeight);
            return User.findOne({
              username,
            });
          })
          .then(user => {
            expect(user).to.not.be.null;
            expect(user.fullName).to.equal(fullName);
            expect(user.currentWeight).to.equal(currentWeight);
            expect(user.goalWeight).to.equal(goalWeight);
            return user.validatePassword(password);
          })
          .then(passwordIsCorrect => {
            expect(passwordIsCorrect).to.be.true;
          }));
      // it('Should trim firstName and lastName', () =>
      //   chai
      //     .request(app)
      //     .post('/api/users')
      //     .send({
      //       username,
      //       password,
      //       fullName: ` ${fullName} `,
      //       currentWeight,
      //       goalWeight,
      //     })
      //     .then(res => {
      //       expect(res).to.have.status(201);
      //       expect(res.body).to.be.an('object');
      //       expect(res.body).to.have.keys('username', 'firstName', 'lastName');
      //       expect(res.body.username).to.equal(username);
      //       expect(res.body.fullName).to.equal(fullName);
      //       expect(res.body.currentWeight).to.equal(currentWeight);
      //       expect(res.body.goalWeight).to.equal(goalWeight);
      //       return User.findOne({
      //         username,
      //       });
      //     })
      //     .then(user => {
      //       expect(user).to.not.be.null;
      //       expect(user.fullName).to.equal(fullName);
      //     }));
    });

    describe('GET', () => {
      it('Should return an empty array initially', () =>
        chai
          .request(app)
          .get('/api/users')
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.length(0);
          }));
      // it('Should return an array of users', () =>
      //   User.create(
      //     {
      //       username,
      //       password,
      //       fullName,
      //       currentWeight,
      //       goalWeight,
      //     },
      //     {
      //       username: usernameB,
      //       password: passwordB,
      //       fullName: fullNameB,
      //       currentWeight: currentWeightB,
      //       goalWeight: goalWeightB,
      //     },
      //   )
      //     .then(() => chai.request(app).get('/api/users'))
      //     .then(res => {
      //       expect(res).to.have.status(200);
      //       expect(res.body).to.be.an('array');
      //       expect(res.body).to.have.length(2);
      //       expect(res.body[0]).to.deep.equal({
      //         username,
      //         fullName,
      //         currentWeight,
      //         goalWeight,
      //       });
      //       expect(res.body[1]).to.deep.equal({
      //         username: usernameB,
      //         fullName: fullNameB,
      //         currentWeight: currentWeightB,
      //         goalWeight: goalWeightB,
      //       });
      //     }));
    });
  });
});
