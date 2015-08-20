/*
 * This creates a db for development and testing  
 */
var config = require("../config");
require('./models/db')(config.db["development"]);
var mongoose = require('mongoose');
var Course = mongoose.model('YogaCourse');
var Event = mongoose.model('YogaEvent');


var yogacourse = (function(opt) {
  var self = this;
  this.opt = opt;
  this.course_id;
  this.seatsLeft = 2;
  
  
  function increateDate(date) {
    date.setDate(date.getDate() + 7); 
  };
  
  function setHoursMinutes(date, hh, mm) {
    date = new Date(date);
    date.setHours(hh);
    date.setMinutes(mm);
    return date;
  };

  function createEvent(date) {
    var startTime,
        endTime,
        time;
    
    time = self.opt.timeStart.split(":");
    startTime = setHoursMinutes(date, time[0], time[1]);
    time = self.opt.timeEnd.split(":");
    endTime = setHoursMinutes(date, time[0], time[1]);
    

    Event.create({
      date: startTime,
      startTime: startTime,
      endTime: endTime,
      instructor: self.opt.instructor,
      seatsLeft: self.seatsLeft,
      course: self.course_id
    }, function(err, evt) {
      if (err) {
        console.log("Something went wrong when creating an event");
        console.log(err);
      }
    });
  };

  function createEvents() {
    var date = self.opt.startDate;

    while (date <= self.opt.endDate) {
      createEvent(date);
      increateDate(date);
    }

  };


  function writeToDb() {
    console.log("Write to db");
    Course.create(self.opt, function(err, course) {
      if (err) {
        console.log("Something went wrong");
        console.log(err);
      } else {
        console.log("success");
        self.course_id= course._id; 
        createEvents();
      }
    });
  };


  return {
    writeToDb: writeToDb()
  }
});

var course1 = new yogacourse({
  startDate:    new Date("2015-08-17"),
  endDate:      new Date("2015-12-14"),
  weekday:      "Måndag",
  timeStart:    "18:30",
  timeEnd:      "19:45",
  instructor:   "Agneta Persevall",
  description:  "Forsättning, utövat yoga tidigare",
  seats:        7
})


var course2 = new yogacourse({
  startDate:    new Date("2015-08-17"),
  endDate:      new Date("2015-12-14"),
  weekday:      "Måndag",
  timeStart:    "20:00",
  timeEnd:      "21:15",
  instructor:   "Agneta Persevall",
  description:  "Forsättning, utövat yoga tidigare",
  seats:        7
})



var course3 = new yogacourse({
  startDate:    new Date("2015-08-18"),
  endDate:      new Date("2015-12-15"),
  weekday:      "Tisdag",
  timeStart:    "09:15",
  timeEnd:      "10:30",
  instructor:   "Agneta Persevall",
  description:  "Ny start",
  seats:        7
})

var course4 = new yogacourse({
  startDate:    new Date("2015-08-19"),
  endDate:      new Date("2015-12-16"),
  weekday:      "Onsdag",
  timeStart:    "18:30",
  timeEnd:      "19:45",
  instructor:   "Agneta Persevall",
  description:  "Forsättning, utövat yoga tidigare",
  seats:        7
})

var course5 = new yogacourse({
  startDate:    new Date("2015-08-19"),
  endDate:      new Date("2015-12-16"),
  weekday:      "Onsdag",
  timeStart:    "20:00",
  timeEnd:      "21:15",
  instructor:   "Agneta Persevall",
  description:  "Ny start",
  seats:        7
})

var course6 = new yogacourse({
  startDate:    new Date("2015-08-20"),
  endDate:      new Date("2015-12-16"),
  weekday:      "Torsdag",
  timeStart:    "18:30",
  timeEnd:      "19:45",
  instructor:   "Agneta Persevall",
  description:  "Yoga för manliga deltagare, killar och män",
  seats:        7
})

var course7 = new yogacourse({
  startDate:    new Date("2015-08-20"),
  endDate:      new Date("2015-12-16"),
  weekday:      "Torsdag",
  timeStart:    "20:00",
  timeEnd:      "21:00",
  instructor:   "Agneta Persevall",
  description:  "Meditationsklass",
  seats:        7
})

var course7 = new yogacourse({
  startDate:    new Date("2015-08-22"),
  endDate:      new Date("2015-12-18"),
  weekday:      "Lördag",
  timeStart:    "09:30",
  timeEnd:      "10:45",
  instructor:   "Agneta Persevall",
  description:  "Nystart",
  seats:        7
})
