
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , async = require('async');

var Engine = require('tingodb')();
var db = new Engine.Db('tingodb', {});
var pageStore = db.collection("pages");

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 80);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon('images/jaks.ico'));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/home', routes.home);
app.get('/pages/:pageName', routes.page);
app.get('/users', routes.user);

app.post('/pages/:pageName', routes.update);

app.get('/api/pages', function(req, res) {
  pageStore.find(null, {fields: {'_id':false}}).toArray(function(err, pages) {
    // TODO: error handling
    res.send(pages);
  });
});

app.post('/api/pages', function(req, res) {
  // TODO: validation
  async.forEach(req.body, function(page, callback) {
    pageStore.update({name: page.name}, page, { upsert: true }, function(err, count) {
      callback(err);
    });
  }, function(err) {
    // TODO: better result
    res.send(err ? 'FAILURE' : 'SUCCESS');
  });
});

var acceptFactory = function(mimeType) {
  return function(req, res, next) {
    if (req.headers.accept.indexOf() && req.headers.accept.indexOf(mimeType) != -1) {
      next();
    } else {
      next('route');
    }
  }
};

app.get('/api/accept', acceptFactory('xml'), function(req, res) {
  res.send('<xml>true</xml>');
});

app.get('/api/accept', acceptFactory('json'), function(req, res) {
  res.send({json: true});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
