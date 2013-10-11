
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var Engine = require('tingodb')();
var db = new Engine.Db('tingodb', {});
var pages = db.collection("pages");

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
app.get('/users', routes.user);


pages.findOne({name:'home'}, function(err, item) {
  if (err) {
    console.log(err);
    process.exit();
  } else if (item == null) {
    pages.insert({name:'home', title:'Home Page'}, {w:1}, function(err, result) {
      if (err) {
        console.log(err);
        process.exit();
      } else {
        console.log(result);
      }
    });
  }
  console.log(item);
  console.log(err);
});


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
