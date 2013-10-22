
/*
 * GET home page.
 */

var Engine = require('tingodb')();
var db = new Engine.Db('tingodb', {});
var pageStore = db.collection("pages");

exports.index = function(req, res){
  res.render('index', { title: 'Roland Mechler' });
};

exports.login = function(req, res){
  res.render('login', { title: 'Please Login' });
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

var addPage = function(req, res, item, callback) {
	pageStore.update({name: req.body.name}, {$set: {name: req.body.name, title: req.body.title}}, { upsert: true }, function(err, count) {
	  callback(err);
	});
};

var updatePages = function(req, res, item, callback) {
	if (req.body && req.body.name && req.body.title) {
		addPage(req, res, item, function(err) {
			if (err) {
				console.log('Unable to add page!', err);
				callback(err);
			} else {
				if (!item.pages) {
					item.pages = [];
				}
				item.pages.push({name: req.body.name, title: req.body.title})
				pageStore.update({name: req.params.pageName}, item, { upsert: true }, function(err, count) {
				  callback(err);
				});
			}
		});
	} else {	
		callback(null);
	}
};

var renderPage = function(req, res) {
	console.log(req.params.pageName)
	pageStore.findOne({name:req.params.pageName}, function(err, item) {
		console.log(err)
	  if (err || item == null) {
	    res.send('Page not found!', 404);
	  } else {
	  	updatePages(req, res, item, function(err) {
	  		if (err) {
			    console.log('Unable to update pages!', err);
			  }
		  	updateLinks(req, res, item, function(err) {
		  		if (err) {
				    console.log('Unable to update links!', err);
				  }
				  // TODO: the below wouldn't be needed if can check if variable exiss in jade template... investigate
				  if (!item.links) {
				  	item.links = [];
				  }
				  if (!item.pages) {
				  	item.pages = [];
				  }
		  		res.render('page', item);
		  	});
		  });
	  }

	});
}

exports.page = function(req, res){
	 //  console.log("cookies:");
  // console.log(req.cookies);
  // 	  console.log("session:");
  // console.log(req.session);
  // req.session.user = "me"
	renderPage(req, res);
};

exports.update = function(req, res) {
	console.log(req.body);

	renderPage(req, res);
};
