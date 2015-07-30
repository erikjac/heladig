var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');
var ctrlOther = require('../controllers/others');

/* Main Pages */
router.get('/', ctrlMain.index);
router.get('/yoga', ctrlMain.yoga);
router.get('/massage', ctrlMain.massage);
router.get('/about', ctrlOther.about);
router.get('/contact', ctrlOther.contact);

module.exports = router;
