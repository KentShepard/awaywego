const expect = require('chai').expect;
const axios = require('axios');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const User = require('../../db/models/user');
const PlanEvent = require('../../db/models/event');

require('../../server'); //gets the app started
req = request('http://localhost:8080');

const TEST_USER = {
  name: 'jim',
  email: 'test1@example.com',
  password: 'password1'
};

const TEST_USER_EMAIL = {
  email: 'test1@example.com'
};

const TEST_PLAN = {
  title: 'Test Plan Ever',
};

describe('Server and Authorization', function() {

  before(function(done) {
    User.remove(TEST_USER_EMAIL).then(() => done());
  });

  describe('/', function() {
    it('should return index.html on a get request', function(done) {
      axios.get('http://localhost:8080/')
        .then(function (response) {
          expect(response.data).to.contain('ng-app');
          done();
        })
        .catch(function (error) {
          console.log(error);
          done();
        });
    });
  });

  describe('/auth/login', function() {

    before(function(done) {
      User.create(TEST_USER).then(() => { done(); });
    });

    after(function(done) {
      User.remove(TEST_USER_EMAIL).then(() => done());
    });

    it('should not grant access for invalid email', function(done) {
      req.post('/auth/login')
        .send({
          'email': 'invalid@example.com',
          'password': 'password1'
        })
        .then(function (response) {
          expect(response.body.token).to.not.exist;
          done();
        })
        .catch(function (error) {
          console.log(error);
          done();
        });
    });

    it('should not grant access for invalid password', function(done) {
      req.post('/auth/login')
        .send({
          'email': 'test1@example.com',
          'password': 'invalidpassword'
        })
        .then(function (response) {
          expect(response.body).to.exist;
          done();
        })
        .catch(function (error) {
          console.log(error);
          done();
        });
    });

    it('should grant access for valid credentials', function(done) {
      req.post('/auth/login')
        .send(TEST_USER)
        .then(function (response) {
          expect(response.body.token).to.exist;
          done();
        })
        .catch(function (error) {
          console.log(error);
          done();
        });
    });
  });

  describe('/signup', function() {

    beforeEach(function(done) {
      User.remove(TEST_USER_EMAIL).then(() => done());
    });

    after(function(done) {
      User.remove(TEST_USER_EMAIL).then(() => done());
    });

    it('should return a json web token on a successful signup', function(done) {
      req.post('/auth/signup')
        .send(TEST_USER)
        .then(function (response) {
          expect(response.body.token).to.exist;
          expect(response.statusCode).to.equal(201);
          done();
        });
    });

    it('should not return a token if the user exists', function(done) {
      req.post('/auth/signup')
        .send(TEST_USER)
        .then(() => {
          req.post('/auth/signup')
            .send(TEST_USER)
            .then((response) => {
              expect(response.body.token).to.not.exist;
              expect(response.statusCode).to.equal(422);
              done();
            });
        });
    });

    it('should create a database entry on sign up', function(done) {
      req.post('/auth/signup')
        .send(TEST_USER)
        .expect(201)
        .then((response) => {
          User.findOne({'email': 'test1@example.com'})
            .exec((err, user) => {
              if (err) { console.log(err); }
              expect(user.email).to.equal('test1@example.com');
              done();
            });
        });
    });
  });


}); // End of Describe Server
