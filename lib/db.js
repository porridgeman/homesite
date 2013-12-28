var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var linkSchema = new Schema({
    label: String,
    url: String
});
var pageLinkSchema = new Schema({
    name: String,
    title: String
});
var pageSchema = Schema({
	name: String
  , title: String
  , links: [linkSchema]
  , pages: [pageLinkSchema]
})

exports.init = function(database, callback) {
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


