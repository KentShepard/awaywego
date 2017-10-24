const expect = require('chai').expect;
const axios = require('axios');
const request = require('supertest');
const app = require('../../server/server.js'); //gets the app started
req = request('http://localhost:8080');
const jwt = require('jsonwebtoken');
const User = require('../../db/models/user');
const PlanEvent = require('../../db/models/event');

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
describe('Server tests', function() {

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

  describe('/api', function() {
    // For access to protected routes
    let AUTH;



    // Create a user and set token before api calls
    before(function(done) {
      User.create(TEST_USER).then(() => {
        req.post('/auth/login')
          .send(TEST_USER)
          .then(function (response) {

            AUTH = {Authorization: 'bearer ' + response.body.token};
            done();
          })
          .catch(function (error) {
            console.log(error);
            done();
          });
      });
    });

    after(function(done) {
      User.remove(TEST_USER_EMAIL).then(() => done());
    });

    xdescribe('/plan', function() {

      after(function(done) {
        User.remove(TEST_EVENT).then(() => done());
      });

      it('should create an event entry on a post request', function(done) {
        req.post('/api/event')
          .send(TEST_EVENT)
          .set('Authorization', 'bearer ' + token)
          .expect(201)
          .then((response) => {
            console.log('In protected route');
            PlanEvent.find({_id: response._Id}).then((plan) => {
              console.log(plan);
              expect(plan).to.exist;
              done();
            });
          });
      });
    });


    describe('/event', function() {

      const TEST_EVENT = {
        title: 'John"s best BBQ',
        description: 'We will have a ton of fun at this park...',
        planId: 'undefined',
        startTime: '2016-05-18T16:00:00Z',
        endTime: '2016-05-18T16:00:00Z',
      };

      // Makes a plan and updates planId
      before(function(done) {
        req.post('/api/plan')
          .send(TEST_PLAN)
          .set(AUTH)
          .then((response) => {
            TEST_EVENT.planId = response.body._id;
            done();
          });
      });

      after(function(done) {
        User.remove(TEST_EVENT).then(() => done());
      });

      describe('POST', function() {
        it('should create an event entry on a post request', function(done) {
          req.post('/api/event')
            .send(TEST_EVENT)
            .set(AUTH)
            .expect(201)
            .then((response) => {
              PlanEvent.findOne({_id: response.body._Id}).then((planEvent) => {
                expect(planEvent).to.exist;
                done();
              });
            });
        });
      });

      describe('GET', function() {
        it('should get all events for a particular planId', function(done) {
          req.get('/api/event/' + TEST_EVENT.planId)
            .set(AUTH)
            .expect(200)
            .then((response) => {
              expect(response.body[0].title).to.equal(TEST_EVENT.title);
              done();
            });
        });
      });

      describe('PUT', function() {
        let EVENT_ID;

        before(function(done) {
          req.get('/api/event/' + TEST_EVENT.planId)
            .set(AUTH)
            .expect(200)
            .then((response) => {
              EVENT_ID = response.body[0]._id;
              done();
            });
        });

        after(function(done) {
          PlanEvent.remove({EVENT_ID}).then(() => done());
        });


        it('should allow updating by eventId', function(done) {
          let UPDATED_EVENT = Object.assign({}, TEST_EVENT);
          UPDATED_EVENT.title = 'Updated title';
          req.put('/api/event/' + EVENT_ID)
            .send(UPDATED_EVENT)
            .set(AUTH)
            .expect(200)
            .then((response) => {
              expect(response.body.title).to.equal(UPDATED_EVENT.title);
              PlanEvent.findOne({_id: EVENT_ID}).then((planEvent) => {
                expect(planEvent.title).to.equal(UPDATED_EVENT.title);
                done();
              });
            });

        });

        it('should allow promoting an idea to itinerary', function(done) {
          req.put(`/api/event/${EVENT_ID}/promote`)
            .set(AUTH)
            .expect(200)
            .then((response) => {
              expect(response.body.status).to.equal('itinerary');
              PlanEvent.findOne({_id: EVENT_ID}).then((planEvent) => {
                expect(planEvent.status).to.equal('itinerary');
                done();
              });
            });
        });

        it('should allow demoting an itinerary to idea', function(done) {
          req.put(`/api/event/${EVENT_ID}/demote`)
            .set(AUTH)
            .expect(200)
            .then((response) => {
              expect(response.body.status).to.equal('idea');
              PlanEvent.findOne({_id: EVENT_ID}).then((planEvent) => {
                expect(planEvent.status).to.equal('idea');
                done();
              });
            });
        });

        it('should allow upvoting', function(done) {
          req.put(`/api/event/${EVENT_ID}/upvote`)
            .set(AUTH)
            .expect(200)
            .then((response) => {
              expect(response.body.length).to.equal(1);
              PlanEvent.findOne({_id: EVENT_ID}).then((planEvent) => {
                expect(planEvent.upVotes.length).to.equal(1);
                User.findOne(TEST_USER_EMAIL).then((user) => {
                  expect(planEvent.upVotes).to.contain(user._id);
                  done();
                });
              });
            });
        });

        // if user upVotes, take user off downVotes
        // if user downVotes, take user off upVotes
        // user can only upVote once
        // user can only downVote once


      }); // End of Describe PUT

      describe('DELETE', function() {
        it('should delete an event by id', function(done) {
          req.get(`/api/event/${TEST_EVENT.planId}`)
            .set(AUTH)
            .expect(200)
            .then((response) => {
              const EVENT_ID = response.body[0]._id;
              req.delete('/api/event/' + EVENT_ID)
                .set(AUTH)
                .expect(200)
                .then(() => {
                  PlanEvent.findOne({_id: EVENT_ID}).then((planEvent) => {
                    expect(planEvent).to.not.exist;
                    done();
                  });
                });
            });
        });
      });


    }); // End of Describe /event



  }); // End of Describe /api


}); // End of Describe Server
