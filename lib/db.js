var tungus = require('tungus');
var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var linkSchema = new Schema({
    label: String,
    url: String
});
var pageSchema = Schema({
	name: String
  , title: String
  , links: [linkSchema]
  , pages: []
})

exports.init = function(path, callback) {
	mongoose.connect('tingodb://'+path, function (err) {
	  callback(err);
	});
}

exports.Page = mongoose.model('page', pageSchema);


