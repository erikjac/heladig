var assert = require('assert');
var request = request('supertest');
request('should-http')

describe('Test all yoga courses and events api routes', function() {
  var URL = "localhost:3000";
  var COURSE = { 
        startDate: new Date("2015-08-14"),
        endDate: new Date("2015-12-14"),
        weekday: "Måndag",
        timeStart: "18:00",
        timeEnd: "19:45",
        instructor: "Agneta Persevall",
        description: "För nybörjare",
        seats: 7
    };
  var courseId;


  before(function(done) {
    done();
  });

  it('Should get all yoga course', function(done) {
    request(URL).get('/api/yoga/courses')
    .end(function(err, res) {
      if (err) {
        throw err;
      }
      res.should.have.status(200);
      done();
    })
  });

  it('Should create a yoga course', function(done) {
    request(URL).post('/api/yoga/course')
    .send(COURSE)
    .end(function(err, res) {
      if (err) {
        throw err;
      }
      res.should.have.status(201);
      courseId = res.body._id;
      done();
    })
  });

  it('Should get one yoga course', function(done) {
    request(URL).post('/api/yoga/course/'+courseId)
    .send(COURSE)
    .end(function(err, res) {
      if (err) {
        throw err;
      }
      res.should.have.status(201);
      done();
    })
  });

  it('Should update a yoga course', function(done) {
    testCourseOne.weekday = "Tisdag";

    request(url).put('/api/yoga/course/'+courseId)
      .send(COURSE)
      .end(function(err, res) {

        if (err) {
          throw err
        }
        
        res.should.have.status(200);
        done();
      })
    });

  it('Should delete a yoga course', function(done) {
    request(URL).delete('/api/yoga/course/'+courseId)
    .end(function(err, res) {
      if (err) {
        throw err;
      }
      res.should.have.status(204);
      done();
    })
  });
});  
