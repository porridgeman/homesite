
/*
 * GET home page.
 */

var Engine = require('tingodb')();
var db = new Engine.Db('tingodb', {});
var pageStore = db.collection("pages");

exports.index = function(req, res){
  res.render('index', { title: 'Roland Mechler' });
};

exports.home = function(req, res){
  res.render('home', { title: 'Home Page' });
};

exports.page = function(req, res){
	console.log(req.params);

	pageStore.findOne({name:req.params.pageName}, function(err, item) {
	  if (err) {
	    console.log(err);
	    process.exit();
	  } else if (item == null) {
	    console.log("Page not found!");
	    process.exit();
	  } else {
	  	console.log(item);
	  	res.render('page', item);
	  }

	});
};
