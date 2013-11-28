//var tungus = require('tungus');
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

exports.init = function(database, callback) {
	//mongoose.connect('tingodb://'+path, function (err) {
	mongoose.connect('mongodb://localhost/' + database, function (err) {
		mongoose.set('debug', true)
		db = mongoose.connection;
		db.on('error', console.error.bind(console, 'connection error:'));
		db.once('open', function() {
			callback(err);
		});
	});
}

exports.Page = mongoose.model('Page', pageSchema);


