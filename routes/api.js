
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
      page.links.splice(req.params.linkIndex, 1)
      page.save(function(err) {
        // TODO: better result
        res.send(err ? 'FAILURE' : 'SUCCESS');
      });
    }

  });
};

exports.updateLink = function(req, res) {
  // TODO: validation
  db.Page.findOne({name:req.params.pageName}, function(err, page) {
    if (err || page == null) {
      res.send('Page not found!', 404);
    } else {

      req.params.linkIndex.split(",").forEach(function(index) {
        // TODO: need to do this because we don't have an _id for the updates. I think it's because there is a schema
        //       for the link. Should I get rid of that?
        var update = req.body.updates.shift();
        page.links[index].url = update.url;
        page.links[index].label = update.label;
      });

      page.save(function(err) {
        // TODO: better result
        res.send(err ? 'FAILURE' : 'SUCCESS');
      });
    }

  });
};
