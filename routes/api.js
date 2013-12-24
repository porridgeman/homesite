
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

exports.insertLink = function(req, res) {

  console.log(req.body)


  //TODO: validation
  db.Page.findOne({name:req.params.pageName}, function(err, page) {
    if (err || page == null) {
      res.send('Page not found!', 404);
    } else {

      page.links.splice(req.params.linkIndex, 0, req.body);
      page.save(function(err) {
        // TODO: better result
        res.send(err ? 'FAILURE' : 'SUCCESS');
      });
    }

  });
};

exports.removePage = function(req, res) {
  // TODO: validation
  db.Page.findOne({name:req.params.pageName}, function(err, page) {
    if (err || page == null) {
      res.send('Page not found!', 404);
    } else {
      page.pages.splice(req.params.pageIndex, 1)
      page.save(function(err) {
        // TODO: better result
        res.send(err ? 'FAILURE' : 'SUCCESS');
      });
    }

  });
};

exports.updatePage = function(req, res) {
  // TODO: validation
  db.Page.findOne({name:req.params.pageName}, function(err, page) {
    if (err || page == null) {
      res.send('Page not found!', 404);
    } else {

      req.params.pageIndex.split(",").forEach(function(index) {
        // TODO: need to do this because we don't have an _id for the updates. I think it's because there is a schema
        //       for the link. Should I get rid of that?
        var update = req.body.updates.shift();
        page.pages[index].name = update.name;
        page.pages[index].title = update.title;
      });

      page.save(function(err) {
        // TODO: better result
        res.send(err ? 'FAILURE' : 'SUCCESS');
      });
    }

  });
};

var addPage = function(req, res, callback) {
  db.Page.update({name: req.body.name}, {$set: {name: req.body.name, title: req.body.title}}, { upsert: true }, function(err, count) {
    callback(err);
  });
};

exports.insertPage = function(req, res) {

  //TODO: validation
  db.Page.findOne({name:req.params.pageName}, function(err, page) {
    if (err || page == null) {
      res.send('Page not found!', 404);
    } else {
console.log(req.body)
      addPage(req, res, function(err) {
        console.log(err)
        if (err) {
          console.log('Unable to add page!', err);
          res.send('FAILURE');
        } else {
          page.pages.splice(req.params.pageIndex, 0, req.body);
          page.save(function(err) {
            // TODO: better result
            res.send(err ? 'FAILURE' : 'SUCCESS');
          });
        }
      });
    }

  });
};
