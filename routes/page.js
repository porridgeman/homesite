
var db = require('../lib/db')

var updateLinks = function(req, res, page, callback) {
	if (req.body && req.body.label && req.body.url) {
		if (!page.links) {
			page.links = [];
		}
		page.links.push({label: req.body.label, url: req.body.url})
		page.save(function(err) {
		  callback(err);
		});
	} else {	
		callback(null);
	}
};

var addPage = function(req, res, callback) {
	db.Page.update({name: req.body.name}, {$set: {name: req.body.name, title: req.body.title}}, { upsert: true }, function(err, count) {
	  callback(err);
	});
};

var updatePages = function(req, res, page, callback) {
	if (req.body && req.body.name && req.body.title) {
		addPage(req, res, function(err) {
			if (err) {
				console.log('Unable to add page!', err);
				callback(err);
			} else {
				if (!page.pages) {
					page.pages = [];
				}
				page.pages.push({name: req.body.name, title: req.body.title})
				page.save(function(err) {
				  callback(err);
				});
			}
		});
	} else {	
		callback(null);
	}
};

var renderPage = function(req, res) {
	db.Page.findOne({name:req.params.pageName}, function(err, page) {
	  if (err || page == null) {
	    res.send('Page not found!', 404);
	  } else {
	  	updatePages(req, res, page, function(err) {
	  		if (err) {
			    console.log('Unable to update pages!', err);
			  }
		  	updateLinks(req, res, page, function(err) {
		  		if (err) {
				    console.log('Unable to update links!', err);
				  }
				  // TODO: the below wouldn't be needed if can check if variable exiss in jade template... investigate
				  if (!page.links) {
				  	page.links = [];
				  }
				  if (!page.pages) {
				  	page.pages = [];
				  }
				  page.baseUrl = (req.secure ? 'https' : 'http') + '://' + req.headers.host; // TODO: better way? middleware?
		  		res.render('page', page);
		  	});
		  });
	  }

	});
}

exports.get = function(req, res){
	renderPage(req, res);
};

exports.update = function(req, res) {
	renderPage(req, res);
};
