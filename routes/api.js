
var async = require('async');
var db = require('../lib/db');

exports.getPages = function(req, res) {

  db.Page.find().select('-_id -__v').exec(function(err, pages) {
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

exports.removeLink = function(req, res) {
  // TODO: validation
  db.Page.findOne({name:req.params.pageName}, function(err, page) {
    if (err || page == null) {
      res.send('Page not found!', 404);
    } else {
      console.log("removeLink(", req.params.pageName, ", ", req.params.linkIndex, ")");
      res.send('SUCCESS');
    }

  });
};
