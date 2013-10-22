
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

  app.use(express.cookieParser());
  app.use(express.cookieSession({secret: 'blah'})); // TODO better secret?

  // Require basic auth for API calls.
  app.use('/api/', express.basicAuth(function(user, pass){
    return 'rmechler' == user && 'temp12' == pass;
  }));

  var checkAuth = function() {
    return function(req, res, next) {
      console.log('session:')
      console.log(req.session)
      if (!req.session.user) {
        res.redirect('/login');
      } else {
        next();
      }
    }
  }

  // Require auth for pages.
  app.use('/pages/', checkAuth());

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



app.get('/login', routes.login);

app.post('/login', function (req, res) {
  var post = req.body;
  if (post.user == 'rmechler' && post.password == 'temp12') {
    req.session.user = 1;  // TODO we really want to look up a user id here
    res.redirect('/pages/home'); // TODO can we preserve the page user was originally trying to see?
  } else {
    res.send('Bad user/pass');
  }
});

/*
 * API
 */

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
