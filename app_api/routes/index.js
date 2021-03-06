var express = require('express');
var router = express.Router();
var ctrlYoga= require('../controllers/yoga');

/* Main Pages */
/* YOGA COURSES */
router.get('/yoga/course', ctrlYoga.courses);
router.get('/yoga/course/:courseid', ctrlYoga.getCourse);
router.post('/yoga/course', ctrlYoga.createCourse);
router.delete('/yoga/course/:courseid', ctrlYoga.deleteCourse);
router.put('/yoga/course/:courseid', ctrlYoga.updateCourse);
router.post('/yoga/course/:courseid/user', ctrlYoga.registerUserToCourse);

/* YOGA COURSES EVENTS */ 
router.post('/yoga/course/:courseid/event', ctrlYoga.addEvent);
router.get('/yoga/course/:courseid/event', ctrlYoga.events);
router.get('/yoga/course/event/:eventid', ctrlYoga.getEvent);
router.get('/yoga/course/event/:datestart/:dateend', ctrlYoga.eventsByDate);
router.put('/yoga/course/event/:eventid', ctrlYoga.updateEvent);
router.delete('/yoga/course/event/:eventid', ctrlYoga.deleteEvent);

/* YOGA COURSE EVENT USERS */
router.post('/yoga/course/event/:eventid/user', ctrlYoga.addUser);
router.delete('yoga/course/event/:eventid/user/:userid', ctrlYoga.deleteUser);

module.exports = router;
