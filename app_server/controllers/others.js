/*
 * GET home page.
 */

exports.about = function(req, res) {
  res.render('about', {title: 'om mig'});
};

exports.contact = function(req, res) {
  res.render('contact', {title: 'kontakt'});
};



