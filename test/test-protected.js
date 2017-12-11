global.DATABASE_URL = 'mongodb://localhost/jwt-auth-demo-test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app, runServer, closeServer } = require('../server');
const { User } = require('../users');
const { JWT_SECRET } = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Protected endpoint', () => {
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
        workouts,
      })));

  afterEach(() => User.remove({}));

  describe('/api/protected', () => {
    it('Should reject requests with no credentials', () =>
      chai
        .request(app)
        .get('/api/protected')
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
        .get('/api/protected')
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
          exp: Math.floor(Date.now() / 1000) - 10,
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: username,
        },
      );

      return chai
        .request(app)
        .get('/api/protected')
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
  });
});
