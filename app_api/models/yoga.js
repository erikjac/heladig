var mongoose = require('mongoose');
/*
 * TODO
 * -Change name to paricipant
 */
var user = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
})
/*
 * TODO
 * - Should maybe add a value for occepied seats thats equals number of users and
 * prereserved seats
 * - CHange name from users to participants
 */
var yogaEvent = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  instructor: String,
  seatsLeft: Number,
  participants: [user],
  course: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'YogaCourse',
    required: true}
});
/*
 * TODO
 * - Should maybe add default available seats
 */
var yogaCourse = new mongoose.Schema({
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  weekday: {
    type: String,
    required: true
  },
  timeStart: {
    type: String,
    required: true
  },
  timeEnd: {
    type: String,
    required: true
  },
  instructor : String,
  description: String,
  seats: Number
});

mongoose.model('YogaEvent', yogaEvent);
mongoose.model('YogaCourse', yogaCourse);
