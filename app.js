
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var page = require('./routes/page');
var api = require('./routes/api');
var http = require('http');
var https = require('https');
var path = require('path');
var fs = require("fs");
var db = require('./lib/db');

var app = express();

// TODO: also support default config?
var config = eval('('+fs.readFileSync(path.join(process.cwd(), 'config/private.js'), 'utf-8')+')');

var options = {
  ssl: {
    key: fs.readFileSync(path.join(config.ssl.dir, 'key.pem')).toString(),
    cert: fs.readFileSync(path.join(config.ssl.dir, 'cert.pem')).toString()
  }
};

var requireSession = function(req, res, next) {
  if (!req.session.userId) {
    res.redirect('/login');
  } else {
    next();
  }
}

var requireSecure = function(req, res, next) {
  if (!req.secure) {
    res.send(404, "Not found"); // TODO: is there a more appropriate error?
  } else {
    next();
  }
}

var redirectSecure = function(req, res, next) {
  if (!req.secure) {

    redirectUrl = "https://" + req.headers.host.replace(/:.*/, ":" + app.get("sslport")) + req.originalUrl; // TODO: this is not quite right, but will generally work
    console.log("Redirecting to secure: " + redirectUrl)
    res.redirect(redirectUrl);
  } else {
    next();
  }
}

var userFromSession = function(req, res, next) {
  if (req.session.userId == 1) {
    req.user = "rmechler@gmail.com"; // TODO: look this up
  }
  next();
}

var verifyBasicAuth = function(user, pass){
  return 'rmechler@gmail.com' == user && 'temp12' == pass;
}

app.configure(function(){
  app.set('port', config.port || 80);
  app.set('sslport', config.ssl.port || 443);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon('images/jaks.ico'));
  app.use(express.logger('dev'));

  app.use(express.cookieParser());
  app.use(express.cookieSession({secret: 'blah'})); // TODO better secret?

  app.use(function(req, res, next) {
    res.locals.baseUrl = req.protocol + '://' + req.headers.host;
    next();
  });

  app.use('/login', redirectSecure);

  app.use('/api/', requireSecure);
  app.use('/api/', userFromSession);
  app.use('/api/', express.basicAuth(verifyBasicAuth));

  app.use('/pages/', redirectSecure);
  app.use('/pages/', requireSession);

  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.directory(path.join(__dirname, 'public')));
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

app.delete('/api/pages/:pageName/links/:linkIndex', api.removeLink);

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

db.init('homesite', function() {
  http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
  });
  https.createServer(options.ssl, app).listen(app.get('sslport'), function(){
    console.log("Secure Express server listening on port " + app.get('sslport'));
  });
});
