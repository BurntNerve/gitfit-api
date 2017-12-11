global.DATABASE_URL = 'mongodb://localhost/jwt-auth-demo-test';
const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');
const { User } = require('../users');

const expect = chai.expect;

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
      it('Should reject users with duplicate username', () =>
        User.create({
          username,
          password,
          fullName,
          currentWeight,
          goalWeight,
        })
          .then(() =>
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
    });
  });
});
