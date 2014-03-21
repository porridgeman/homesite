var async = require('async');
var db = require('../lib/db');

var updatePage = function(page) {
	page.owner = 1;
};

var updatePages = function() {
  db.Page.find().exec(function(err, pages) {
	pages.forEach(function(page) {
		updatePage(page);
		page.save();
	});
  });
};

db.init('homesite', function() {
  updatePages();
});

