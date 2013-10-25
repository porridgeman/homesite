
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var page = require('./routes/page');
var api = require('./routes/api');
var http = require('http');
var path = require('path');
var db = require('./lib/db');

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
    return 'rmechler@gmail.com' == user && 'temp12' == pass;
  }));

  var checkAuth = function() {
    return function(req, res, next) {
      if (!req.session.userId) {
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

app.get('/pages/:pageName', page.get);
app.post('/pages/:pageName', page.update);

app.get('/login', user.getLogin);
app.post('/login', user.postLogin);
app.post('/logout', user.logout);

app.get('/api/pages', api.getPages);
app.post('/api/pages', api.updatePages);

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

db.init(__dirname+'/tingodb', function() {
  http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
  });
});
