global.DATABASE_URL =
  'mongodb://test-user:test-pass@ds033196.mlab.com:33196/gitfit-test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app, runServer, closeServer } = require('../server');
const { User } = require('../users');
const { JWT_SECRET } = require('../config');

const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('Auth endpoints', () => {
  const username = 'exampleUser';
  const password = 'examplePass';
  const fullName = 'example name';
  const currentWeight = '175';
  const goalWeight = '190';
  const workouts = [];

  before(() => runServer());

  after(() => closeServer());

  beforeEach(() =>
    User.hashPassword(password).then(password =>
      User.create({
        username,
        password,
        fullName,
        currentWeight,
        goalWeight,
      })));

  afterEach(() => User.remove({}));

  describe('/api/auth/login', () => {
    it('Should reject requests with no credentials', () =>
      chai
        .request(app)
        .post('/api/auth/login')
        .then(() => expect.fail(null, null, 'Request should not succeed'))
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(400);
        }));
    it('Should reject requests with incorrect usernames', () =>
      chai
        .request(app)
        .post('/api/auth/login')
        .send({ username: 'wrongUsername', password })
        .then(() => expect.fail(null, null, 'Request should not succeed'))
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(401);
        }));
    it('Should reject requests with incorrect passwords', () =>
      chai
        .request(app)
        .post('/api/auth/login')
        .send({ username, password: 'wrongPassword' })
        .then(() => expect.fail(null, null, 'Request should not succeed'))
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(401);
        }));
    it('Should return a valid auth token', () =>
      chai
        .request(app)
        .post('/api/auth/login')
        .send({ username, password })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          const token = res.body.authToken;
          expect(token).to.be.a('string');
          const payload = jwt.verify(token, JWT_SECRET, {
            algorithm: ['HS256'],
          });
          expect(payload.user).to.deep.equal({
            username,
            fullName,
            currentWeight,
            goalWeight,
            workouts,
          });
        }));
  });

  describe('/api/auth/refresh', () => {
    it('Should reject requests with no credentials', () =>
      chai
        .request(app)
        .post('/api/auth/refresh')
        .then(() => expect.fail(null, null, 'Request should not succeed'))
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(401);
        }));
    it('Should reject requests with an invalid token', () => {
      const token = jwt.sign(
        {
          username,
          fullName,
          currentWeight,
          goalWeight,
          workouts,
        },
        'wrongSecret',
        {
          algorithm: 'HS256',
          expiresIn: '7d',
        },
      );

      return chai
        .request(app)
        .post('/api/auth/refresh')
        .set('Authorization', `Bearer ${token}`)
        .then(() => expect.fail(null, null, 'Request should not succeed'))
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(401);
        });
    });
    it('Should reject requests with an expired token', () => {
      const token = jwt.sign(
        {
          user: {
            username,
            fullName,
            currentWeight,
            goalWeight,
            workouts,
          },
          exp: Math.floor(Date.now() / 1000) - 10, // Expired ten seconds ago
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: username,
        },
      );

      return chai
        .request(app)
        .post('/api/auth/refresh')
        .set('authorization', `Bearer ${token}`)
        .then(() => expect.fail(null, null, 'Request should not succeed'))
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(401);
        });
    });
    it('Should return a valid auth token with a newer expiry date', () => {
      const token = jwt.sign(
        {
          user: {
            username,
            fullName,
            currentWeight,
            goalWeight,
            workouts,
          },
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: username,
          expiresIn: '7d',
        },
      );
      const decoded = jwt.decode(token);

      return chai
        .request(app)
        .post('/api/auth/refresh')
        .set('authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          const token = res.body.authToken;
          expect(token).to.be.a('string');
          const payload = jwt.verify(token, JWT_SECRET, {
            algorithm: ['HS256'],
          });
          expect(payload.user).to.deep.equal({
            username,
            fullName,
            currentWeight,
            goalWeight,
            workouts,
          });
          expect(payload.exp).to.be.at.least(decoded.exp);
        });
    });
  });
});
