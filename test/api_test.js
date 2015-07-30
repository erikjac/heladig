var should = require('should'); 
var assert = require('assert');
var request = require('supertest');  
var mongoose = require('mongoose');
require('should-http');

describe('API TEST', function() {
  var url = 'localhost:3000';
  var mongoUri = 'mongodb://localhost/heladig';
  var testCourseOneId;
  var testCourseTwoId;
  var testCourseOne = { 
        startDate: new Date("2015-08-14"),
        endDate: new Date("2015-12-14"),
        weekday: "Måndag",
        timeStart: "18:00",
        timeEnd: "19:45",
        instructor: "Agneta Persevall",
        description: "För nybörjare",
        seats: 7
    };
  var testCourseTwo = {
        startDate: new Date("2015-08-16"),
        endDate: new Date("2015-12-16"),
        weekday: "Tisdag",
        timeStart: "09:00",
        timeEnd: "10:15",
        instructor: "Agneta Persevall",
        description: "För de som yogat",
        seats: 7
  };
  var testEventOneid;
  var testEventTwoid;
  var testEventOne = {
        date: new Date("2015-08-14"), 
        seatsLeft: 2,
  };
  var testEventTwo = {
        date: new Date("2015-08-16"),
        startTime: new Date("2015-08-16:09:00"), 
        endTime: new Date("2015-08-16:10:15"),
        instructor: "Erik Jacobson",
        seatsLeft: 0,
  };

 
  before(function(done) {
      mongoose.connect(mongoUri);
      done();
  });
 
  it('should try to create a yoga course but with to few arguments so it should fail with error code 404', function(done) {
    var course = {
      startDate: Date.now(),
      weekday: "Monday",
      timeStart: 1170,
      timeEnd: 1245
    };
      
    request(url).post('/api/yoga/course')
      .send(course)
      .end(function(err, res) {
        res.should.have.status(404);
        done()
      });
  }); 

  it('should try to create a yoga course and succed with return code 201', function(done) {
    request(url).post('/api/yoga/course')
      .send(testCourseOne)
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        res.should.have.status(201);
        testCourseOneId = res.body._id;
        testEventOne.course = res.body_id;
        done();
      });
  });

  it('should try to get all yoga courses a succeed with code 200', function(done) {
    request(url).get('/api/yoga/course')
      .end(function(err, res) {
        if (err) {
          throw err;
        }

        res.should.have.status(200);
        done();
      });
  });

  it('should try to get a yoga course with a id that not exists in the database and should get eerror code 404 and massage that course dosent exists', function(done) {
    request(url).get('/api/yoga/course/1234')
      .end(function(err, res) {
        res.should.have.status(404);
        done();
      })
  });
  
  it('should try to get a yoga course with a id that does exists in the database and return 200',function(done) {
    request(url).get('/api/yoga/course/'+testCourseOneId)
      .end(function(err, res) {
        if (err) {
          throw err;
        }

        res.should.have.status(200);
        done();
      });
  });

  it('should try to update a yoga course with wrong courseid and get a code 404 back', function(done) {
    
    testCourseOne.weekday = "Tisdag";

    request(url).put('/api/yoga/course/123')
      .send(testCourseOne)
      .end(function(err, res) {
        res.should.have.status(400);
        done();
      });
  });

  it('should try to update a yoga course with course id and respnse with code 200', function(done) {
    testCourseOne.weekday = "Tisdag";

    request(url).put('/api/yoga/course/'+testCourseOneId)
      .send(testCourseOne)
      .end(function(err, res) {

        if (err) {
          throw err
        }
        
        res.should.have.status(200);
        res.body.weekday.should.equal("Tisdag");
        done();
      })
    });

  it('should create another course and response with code 200', function(done) {
    request(url).post('/api/yoga/course')
      .send(testCourseTwo)
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        res.should.have.status(201);
        testCourseTwoId= res.body._id;
        testEventTwo.course = res.body._id;
        done();
      });
  });
  
  it('should try to create a new yoga event to a course with the wrong course id and respond with 400', function(done) {
    request(url).post('/api/yoga/course/123/event')
      .send(testEventOne)
      .end(function(err, res) {
        res.should.have.status(400);
        done();
      });
  });

  it('should try to create a new yoga event to a yoga course and get response 200', function(done) {
    request(url).post('/api/yoga/course/'+testCourseOneId+'/event')
      .send(testEventOne)
      .end(function(err, res) {

        if (err) {
          throw err
        }

        res.should.have.status(201);
        testEventOneid= res.body._id;
        done();
      });
  });


  it('should try to create a new yoga event to a yoga course and get response 200', function(done) {
    request(url).post('/api/yoga/course/'+testCourseOneId+'/event')
      .send(testEventTwo)
      .end(function(err, res) {

        if (err) {
          throw err;
        }

        res.should.have.status(201);
        testEventTwoid = res.body._id;
        done();
      });
  });

  it('should try to get all events för a yoga course that dosent exists and respond with 400', function(done) {
    request(url).get('/api/yoga/course/123/event')
      .end(function(err, res) {
        res.should.have.status(400);
        done();
      })
  });

  it('should try to get all events for a yoga course and respond with a 200 code', function(done) {
    request(url).get('/api/yoga/course/'+testCourseOneId+'/event')
      .end(function(err, res) {
        
        if (err) {
          throw err;
        }

        res.should.have.status(200);
        res.body.length.should.equal(2);
        done();
      })
  });

  it('should try to update a event with the wrong eventid', function(done) {
    request(url).put('/api/yoga/course/event/123')
      .send(testEventOne)
      .end(function(err, res) {
        
        res.should.have.status(400);
        done();
      });
  });

  it('should try to update a event with eventid', function(done) {
    var req = testEventTwo;
    request(url).put('/api/yoga/course/event/'+testEventTwoid)
      .send(req)
      .end(function(err, res) {
        
        if (err) {
          throw err;
        }
        res.should.have.status(200);
        done();
      });
  });

  it('should try to delete a event from a yoga course with invalidg evend id', function(done) {
    request(url).delete('/api/yoga/course/event/123')
      .end(function(err, res) {

        res.should.have.status(400);
        done();
      })
  });
  
  it('should try to delet a event from a yoga course', function(done) {
    request(url).delete('/api/yoga/course/event/'+testEventTwoid)
      .end(function(err, res) {
        
        if (err) {
          throw err;
        }

        res.should.have.status(204);
        done();
      });
  });
  
  it('should try to delete a yoga course with the wrong courseid', function(done) {
    request(url).delete('/api/yoga/course/123')
      .end(function(err, res) {
        res.should.have.status(400);
        done();
      });
  });

  it('it should try to delete a yoga course with the right courseid', function(done) {
    request(url).delete('/api/yoga/course/'+testCourseOneId)
      .end(function(err, res) {
        res.should.have.status(204);
        done();
      });
  });

  it('it should try to delete a yoga course with the right courseid', function(done) {
    request(url).delete('/api/yoga/course/'+testCourseTwoId)
      .end(function(err, res) {
        res.should.have.status(204);
        done();
      });
  });
});


