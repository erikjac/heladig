
/*
 * GET home page.
 */

exports.index = function(req, res) {
  res.render('index', { title: 'Senaste nytt' });
};

exports.massage = function(req, res) {
  res.render('massage', { title: 'Massage' });
}; 

exports.yoga = function(req, res) {
  res.render('yoga', { title: 'Yoga'});
};

