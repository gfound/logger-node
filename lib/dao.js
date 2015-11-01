var async = require('async'),
	mongoose = require('mongoose');

(function() {

	var root = this;
	var Dao = {};

	var _config;
	var db;
	var modelNames = [];

	function connect(next) {

		if (_config.user && _config.password) {
			var dbUrl = 'mongodb://' + _config.user + ':' + _config.password + '@' + _config.host + ':' + _config.port + '/' + _config.database;
		} else {
			var dbUrl = 'mongodb://' + _config.host + ':' + _config.port + '/' + _config.database;
		}

		db = mongoose.createConnection(dbUrl, next);

		db.on('error', console.error.bind(console, 'db connect error:'));
	}

	Dao.connect = function(config, callback) {
		_config = config;
		callback = callback || function() {};

		async.series([
			connect
		], function(err, result) {
			if (err) {
				callback(err);
			} else {
				callback();
			}
		});
	}

	Dao.close = function() {
		disconnect();
	}

	Dao.model = function(modelName) {
		var schema = new mongoose.Schema({
			name: String,
			hostname: String,
			pid: String,
			level: String,
			// username: String,
			msg: String,
			time: String,
			src: {
				type: {},
				required: false
			},
			v: Number
		}, {
			versionKey: false,
			strict: false
		});

		db.model(modelName, schema, modelName);

		return db.model(modelName);
	}

	module.exports = Dao;
})();