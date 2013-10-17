
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

var updateLinks = function(req, res, item, callback) {
	if (req.body && req.body.label && req.body.url) {
		if (!item.links) {
			item.links = [];
		}
		item.links.push({label: req.body.label, url: req.body.url})
		pageStore.update({name:req.params.pageName}, item, { upsert: true }, function(err, count) {
		  callback(err);
		});
	} else {	
		callback(null);
	}
};

var renderPage = function(req, res) {
	pageStore.findOne({name:req.params.pageName}, function(err, item) {
	  if (err || item == null) {
	    res.send('Page not found!', 404);
	  } else {
	  	updateLinks(req, res, item, function(err) {
	  		if (err) {
			    console.log('Unable to update links!', err);
			  }
	  		res.render('page', item);
	  	});
	  }

	});
}

exports.page = function(req, res){
	renderPage(req, res);
};

exports.update = function(req, res) {
	console.log(req.body);

	renderPage(req, res);
};
