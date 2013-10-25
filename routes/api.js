
var async = require('async');
var db = require('../lib/db');

exports.getPages = function(req, res) {

  db.Page.find().select('-_id').exec(function(err, pages) {
    // TODO: error handling
    res.send(pages);
  });
};

exports.updatePages = function(req, res) {
  // TODO: validation
  async.forEach(req.body, function(page, callback) {
    db.Page.update({name: page.name}, page, { upsert: true }, function(err, count) {
      callback(err);
    });
  }, function(err) {
    // TODO: better result
    res.send(err ? 'FAILURE' : 'SUCCESS');
  });
};
