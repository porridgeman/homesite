
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

var renderPage = function(req, res) {
		pageStore.findOne({name:req.params.pageName}, function(err, item) {
	  if (err) {
	    console.log(err);
	    process.exit();
	  } else if (item == null) {
	    console.log("Page not found!");
	    process.exit();
	  } else {
	  	if (req.body && req.body.label && req.body.url) {
	  		if (!item.links) {
					item.links = [];
				}
				item.links.push({label: req.body.label, url: req.body.url})
				pageStore.update({name:req.params.pageName}, item, { upsert: true }, function(err, count) {
				  if (err) {
				    console.log(err);
				    process.exit();
				  }
				  res.render('page', item);
				});
	  	} else {	
	  		res.render('page', item);
	  	}
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
