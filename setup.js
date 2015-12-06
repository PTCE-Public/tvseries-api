var join = require('path').join
  , express = require('express')
  , compress = require('compression')
  , responseTime = require('response-time')
  , bodyParser = require('body-parser')
  , logger = require('morgan');

var mongoose = require('mongoose');
var config = require('./config');

RegExp.escape = function(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//mongoose.connect('mongodb://localhost/popcorn_shows', options);
mongoose.connect('mongodb://' + config.dbHosts.join(',') + '/popcorn_shows', {
	db: { native_parser: true },
	replset: { 
		rs_name: 'pt0', 
		connectWithNoPrimary: true, 
		readPreference: 'nearest', 
		strategy: 'ping',
		socketOptions: {
			keepAlive: 1
		}
	}, 
	server: { 
		readPreference: 'nearest', 
		strategy: 'ping',
		socketOptions: {
			keepAlive: 1
		}
	}
});

module.exports = function(config, app) {
	app.use(bodyParser());
	app.use(compress({
		threshold: 1400,
		level: 4,
		memLevel: 3
	}));
	app.use(responseTime());
	app.use(logger('short'));
}
