var mailgun = require("../mailgun.js");
var mongoose = require('mongoose');
var Course = mongoose.model('YogaCourse');
var Event = mongoose.model('YogaEvent');
var config = require('../../config');

var sendJSONresponse = function(res, status, content){
    res.status(status);
    res.json(content);
};

var hasCourseid = function(req, res) {
  var noCourseIdMessage = "No courseid in request";

  if (!req.params && !req.params.courseid) {
    sendJSONresponse(res, 404, {
      "message": noCourseIdMessage
    });
    return false;
  }

  return true;
}

var hasEventid = function(req, res) {
  var noEventIdMessage = 'No eventid in request';

  if(!req.params && !req.params.eventid) {
    sendJSONresponse(res, 404, {
      "message": noEventIdMessage
    });
    return false;
  }

  return true;
}

var hasUserid = function(req, res) {
  var noUserIdMessage = 'No userid in request';

  if(!req.params && !req.params.userid) {
    sendJSONresponse(res, 404, {
      "message": noUserIdMessage
    });
    return false;
  }

  return true;
};

/*
 * Returns all yoga courses
 * GET /api/yoga/course
 */
module.exports.courses = function(req, res) {

  Course.find({})
    .sort({startDate: 1})
    .exec(function(err, courses) {
    if (err) {
      sendJSONresponse(res, 404, err);
    } else {
      sendJSONresponse(res, 200, courses)
    }
  });

};

/*
 * Get a course with id
 * GET /api/yoga/course/:courseid
 */
module.exports.getCourse = function(req, res) {
  
  if (!req.params && !req.params.courseid) {
    sendJSONresponse(res, 403, {
      "message": noCourseIdMessage
    });
    return;
  }

  Course.findById(req.params.courseid)
    .exec(function(err, course) {
      if (err) {
        sendJSONresponse(res, 404, err);
      } else if (!course) {
        sendJSONresponse(res, 404, {"message": "no course with id " + req.params.courseid + " found"});
      } else {
        sendJSONresponse(res, 200, course);
      }
    });
};

/*
 * Create a new yoga course
 * POST /api/yoga/course
 */
module.exports.createCourse= function(req, res) {
  
  Course.create({
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    weekday: req.body.weekday,
    timeStart: req.body.timeStart,
    timeEnd: req.body.timeEnd,
    instructor: req.body.instructor,
    description: req.body.description,
    seats: req.body.seats
    }, function(err, course) {
      if (err) {
        sendJSONresponse(res, 404, err);
      } else {
        sendJSONresponse(res, 201, course);
      }
 });
};


/*
 * Delete yoga course with id
 * DELETE /api/yoga/course/:courseid
 */
module.exports.deleteCourse = function(req, res) {
 
  if (hasCourseid(req, res)) {
    var courseid;

    if (!mongoose.Types.ObjectId.isValid(req.params.courseid)) {
      sendJSONresponse(res, 400, {
        "message": "invalid courseid"
      });
      return;
    }
  
    courseid = mongoose.Types.ObjectId(req.params.courseid);
    
    Event.find({course: courseid})
      .remove()
      .exec(function(err, evt) {
        if (err) {
          sendJSONresponse(res, 400, err);
        }
      });

    Course.findByIdAndRemove(courseid, function(err, course) {
      if (err) {
        sendJSONresponse(res, 400, err);
      } else {
      sendJSONresponse(res, 204, null)
      }
    });
  }
};

/*
 * Update yoga course with id
 * PUT /api/yoga/course/:courseid
 */
module.exports.updateCourse= function(req, res) {
  
  if (hasCourseid(req, res)) {
    Course.findById(req.params.courseid)
      .exec(function(err, course) {
        if (err) {
          sendJSONresponse(res, 400, err);
          return;
        } else if (!course) {
          sendJSONresponse(res, 404, {
            "message": "courseid not found"
          });
          return;
        }
        
        course.startDate  = req.body.startDate;
        course.endDate    = req.body.endDate;
        course.weekday    = req.body.weekday;
        course.timeStart  = req.body.timeStart;
        course.timeEnd    = req.body.timeEnd;
        course.instructor = req.body.instructor;
        course.description= req.body.description;
        course.seats      = req.body.seats;
        
        course.save(function(err, course) {
          if (err) {
            sendJSONresponse(res, 404, err);
          } else {
            sendJSONresponse(res, 200, course);
          }
        });
      });
  }
};

/*
 * Send a mail to course leader (agenta for now) when a user uses
 * the form to register to a course 
 * GET /api/yoga/course/:courseid/user/:name/:lastname/:email
 * "" +req.params.name + " " + req.params.lastname + " vill anmäla sig till yoga kursen på " + course.weekday + " klockan " + course.timeStart + " - " + course.timeEnd
 */
module.exports.registerUserToCourse = function(req, res) {
  if (hasCourseid(req, res)) {
    Course.findById(req.params.courseid) 
      .exec(function(err, course) {

        if (err) {
          sendJSONresponse(res, 400, err);
        } else if(!course) {
          sendJSONresponse(res, 404, {
            "message": "courseid not found"
          });
        } else {

          var data = {
            from: "Hela Dig Yoga <mailgun@sandbox74b0843887a948dea84c3bdf7ef3daa1.mailgun.org>",
            to: "erja7050@gmail.com",
            subject: "Anmälan till yogaklass",
            text: "" +req.params.name + " " + req.params.lastname + " vill anmäla sig till yoga kursen på " + course.weekday + " klockan " + course.timeStart + " - " + course.timeEnd
          };

          mailgun.sendMail(data, function(err, body) {

            if (err) {
              sendJSONresponse(res, 400, {
                "message": "email error"
              });
            } else {
              sendJSONresponse(res, 200, null);
            }
          });
        }
      });
  }
};

/*
 * Confirm to the user associated with the regcode 
 * and add her to all yoga events for the course
 * GET /api/yoga/course/confirmregistration/:regcode
 */
module.exports.confirmregistration = function(req, res) {

}

/* Konverterar ett events datumobject till datumsträngar istället
 * Detta för att hemsidan alltid ska visa samma tid var du än befinner dig
 * Ett event som skickas till hemsidan måste gå igenom denna funktion
 */
var convertEvent = function(evt) {
  var responseEvent = {};
  var Days = {
    1: "Måndag",
    2: "Tisdag",
    3: "Onsdag",
    4: "Torsdag",
    5: "Fredag",
    6: "Lördag",
    7: "Söndag"
  };
  var months = {
    1: "Januari",
    2: "Februari",
    3: "Mars",
    4: "April",
    5: "Maj",
    6: "Juni",
    7: "Juli",
    8: "Augusti",
    9: "September",
    10: "Oktober",
    11: "November",
    12: "December"
  };

  responseEvent.date = Days[evt.date.getDay()] + " den " + evt.date.getDate() + months[evt.date.getMonth()];
  responseEvent.time = evt.startTime.getHours() + ":" + evt.endTime.getMinutes();
  responseEvent.instructor = evt.instructor;
  responseEvent.seatsLeft = evt.seatsLeft;
  responseEvent.eventUrl = config.url + "/api/yoga/course/event/" + evt._id;
  responseEvent._id = evt._id;

  return responseEvent;
  
};
/*
 * Get all event for all yoga courses between two dates
 * params datestart datestring on format yyyy-mm-dd
 * GET /api/yoga/course/event/:datestart/:dateend
 * TODO
 * -Specify how meny result the reponse should rn
 */
module.exports.eventsByDate = function(req, res) {
  if (req.params && req.params.datestart && req.params.dateend) {

    var start = new Date(req.params.datestart);
    var end   = new Date(req.params.dateend);
    var response = []

    Event.find( {'date': {$gte: start, $lte: end}})
      .sort({date: 1})
      .exec(function(err, events) {
        
        if (err) {
          sendJSONresponse(res, 400, err);
          return;
        } 

        response = events.map(convertEvent);
        
        sendJSONresponse(res, 200, response);
        
      });
  } else {
    sendJSONresponse(res, 404, {
      "message": "No datestart or dateend in request"
    });
  }
};

/*
 * Get all events for a yoga course
 * GET /api/yoga/course/:courseid/event
 */
module.exports.events = function(req, res) {
  if (hasCourseid(req, res)) {
    if (!mongoose.Types.ObjectId.isValid(req.params.courseid)) {
      sendJSONresponse(res, 400, {
        "message": "invalid courseid"
      });
      return;
    }

    var courseid = mongoose.Types.ObjectId(req.params.courseid);

    Event.find({course: courseid})
      .exec(function(err, events) {
        if (!events) {
          sendJSONresponse(res, 404, {
            "message": "courseid not found"
          });
          return;
        } else if (err) {
          sendJSONresponse(res, 400, err);
          return;
        } 

        sendJSONresponse(res, 200, events);

      });
  }
}


/*
 * Get a event for a yoga course
 * GET /api/yoga/course/event/:eventid
 */
module.exports.getEvent = function(req, res) {
  if (hasCourseid(req, res) && hasEventid(req, res)) {
    Event.findById(req.params.eventid)
      .exec(function(err, evt) {
        if(err) {
          sendJSONresponse(res, 400, err);
          return;
        }
        else if (!evt) {
          sendJSONresponse(res, 404, {
              "message": "eventid not found"
          });
          return
        } 
        sendJSONresponse(res, 200, evt);
      });
  }
}

var setHoursMinute = function(date, hh, mm) {
  date.setHours(hh);
  date.setMinutes(mm);
  return date;
};

var doAddEvent = function(req, res, course) {
  
  if (!course) {
    sendJSONresponse(res, 404, {
      "message": "courseid not found"
    })
  } else {
    var startTime;
    var endTime;
    var date = new Date(req.body.date);
    
    if (!req.body.startTime) {
      var time = course.timeStart.split(":");
      startTime = setHoursMinute(date, time[0], time[1]);
    } else {
      startTime = req.body.startTime;
    }

    if (!req.body.endTime) {
      var time = course.timeEnd.split(":");
      endTime = setHoursMinute(date, time[0], time[1]);
    } else {
      endTime = req.body.endTime;
    }

    Event.create({
      date: req.body.date,
      startTime: startTime,
      endTime: endTime,
      instructor: req.body.instructor || course.instructor,
      seatsLeft: req.body.seatsLeft,
      course: course._id
    }, function(err, evt) {
      if (err) {
        sendJSONresponse(res, 400, err);
      } else {
        sendJSONresponse(res, 201, evt);
      }
    });

  }

}
/*
 * Add a yoga event to a course
 * POST /api/yoga/course/:courseid/event
 */
module.exports.addEvent = function(req, res) {
  if (hasCourseid(req, res)) {
    Course.findById(req.params.courseid) 
      .exec(function(err, course) {
        if (err) {
          sendJSONresponse(res, 400, err);
        } else {
          doAddEvent(req, res, course);
        }
      });
  }
}

/*
 * Delete a yoga event from a yoga course
 * DELELTE /api/yoga/course/event/:eventid
 */
module.exports.deleteEvent = function(req, res) {
  if (hasEventid(req, res)) {

    if (!mongoose.Types.ObjectId.isValid(req.params.eventid)) {
      sendJSONresponse(res, 400, {
        "message": "invalid courseid"
      });
      return;
    }

    Event.findByIdAndRemove(req.params.eventid)
      .exec(function(err, course) {
        if (err) {
          sendJSONresponse(res, 400, err);
        } else {
          sendJSONresponse(res, 204, null); 
        }
    });
  }
};

/*
 * Update a yoga event from a yoga course
 * PUT /api/yoga/course/event/:eventid
 */
module.exports.updateEvent = function(req, res) {
  if (hasEventid(req, res)) {
    if (!mongoose.Types.ObjectId.isValid(req.params.eventid)) {
      sendJSONresponse(res, 400, {
        "message": "invalid courseid"
      });
      return;
    }
    

    Event.findById(req.params.eventid)
      .exec(function(err, evt) {
        if (err) {
          sendJSONresponse(res, 400, err);
          return;
        } else if (!evt) {
          sendJSONresponse(res, 404, {
            "message": "eventid not found"
          });
          return;
        }
        evt.date        = req.body.date;
        evt.startTime   = req.body.startTime;
        evt.endTime     = req.body.endTime;
        evt.instructor  = req.body.instructor;
        evt.seatsLeft   = req.body.seatsLeft;
        evt.participants= req.body.participants;
        evt.course      = req.body.course;

        evt.save(function(err, evt) {
          if (err) {
            sendJSONresponse(res, 404, err);
          } else {
            sendJSONresponse(res, 200, evt);
          }
        });
    });
  }
};


var doAddEvent = function(req, res, course) {
  
  if (!course) {
    sendJSONresponse(res, 404, {
      "message": "courseid not found"
    })
  } else {
    var startTime;
    var endTime;
    var date = new Date(req.body.date);
    
    if (!req.body.startTime) {
      var time = course.timeStart.split(":");
      startTime = setHoursMinute(date, time[0], time[1]);
    } else {
      startTime = req.body.startTime;
    }

    if (!req.body.endTime) {
      var time = course.timeEnd.split(":");
      endTime = setHoursMinute(date, time[0], time[1]);
    } else {
      endTime = req.body.endTime;
    }

    Event.create({
      date: req.body.date,
      startTime: startTime,
      endTime: endTime,
      instructor: req.body.instructor || course.instructor,
      seatsLeft: req.body.seatsLeft,
      course: course._id
    }, function(err, evt) {
      if (err) {
        sendJSONresponse(res, 400, err);
      } else {
        sendJSONresponse(res, 201, evt);
      }
    });

  }

}

var addUser = function(evt, req) {

  evt.participants.push({
    firstName: req.body.firstname,
    lastName: req.body.lastname,
    email: req.body.email
  });

  --evt.seatsLeft;

  return evt;
};

var doAddUser = function(req, res, evt) {
  
  // Check that the user is not already registered to this event with it's email
  if (req.body && typeof req.body.email === 'undefined') {
    evt.participants.find({email: req.body.email})
      .exec(function(err, user) {
        if (err) {
          sendJSONresponse(res, 400, err);
          return;
        } else if (user) {
          sendJSONresponse(res, 403, {
            'message': 'user already exists'
          });
          return;
        }
      });
  }

  var evt = addUser(evt, req);

  evt.save(function(err, evt) {
    var thisUser;
    
    if (err) {
      sendJSONresponse(res, 400, err);
    } else {

      var data = {
        from: "Hela Dig Yoga <mailgun@sandbox74b0843887a948dea84c3bdf7ef3daa1.mailgun.org>",
        to: "erja7050@gmail.com",
        subject: "Deltagare har anmält sig till en lektion",
        text: "" +req.params.firstname + " " + req.params.lastname + " har anmält sig till yoga lektionen " + evt.date 
      };

      mailgun.sendMail(data, function(err, body) {

        if (err) {
          sendJSONresponse(res, 400, {
            "message": "email error"
          });
        } else {
          sendJSONresponse(res, 200, null);
        }
      });

      thisUser = evt.participants[evt.participants.length - 1];
      sendJSONresponse(res, 201, thisUser);
        
    }
  });
  
};

/*
 * Add a user to a yoga course event
 *
 * POST /api/yoga/course/event/:eventid/user'
 */
module.exports.addUser = function(req, res) {
  console.log("incoming adduser");
  console.log(req.body);
  if (hasEventid(req, res)) {
    Event.findById(req.params.eventid)
      .exec(function(err, evt) {
        if (err) {
          sendJSONresponse(res, 400, err);
        } else if (!evt) {
          sendJSONresponse(res, 404, {
            "message": "eventid not found"
          });
        } else {
          doAddUser(req, res, evt);
        };
    });
  }
};

/*
 * Remove a user from a yoga course event 
 * DELETE /api/yoga/course/event/:eventid/user/
 */
module.exports.deleteUser = function(req, res) {
  if (hasEventid(req, res)){
    
    var userEmail = req.body.email;

    if (!userEmail) {
      sendJSONresponse(res, 404, {
        "message": "no email in request"
      });
      return;
    }
    
    Event.findOneAndRemove({"participants.email": userEmail}, function(err, user) {
      if (err) {
        sendJSONresponse(res, 400, err);
      } else {
      sendJSONresponse(res, 204, null)
      }
    });
  }
};
