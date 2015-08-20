var config = require('../config');
var mailgun = require('mailgun-js')({apiKey: config.mailgun.api_key, domain: config.mailgun.domain});

module.exports.sendMail = function(data, callback) {
  mailgun.messages().send(data, function(err, body) {
    callback(err, body);
  });
};
