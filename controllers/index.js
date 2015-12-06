var os = require("os");
var config = require('../config');
var fs = require('fs');
var json = JSON.parse(fs.readFileSync('package.json', 'utf8'));
var version = json.version;

module.exports = {
	getIndex: function(req, res) {
		res.json({
			status: 'online', 
			uptime: process.uptime() | 0, 
			server: 'online',
			updated: config.lastRefresh ? config.lastRefresh.toString() : 'Unknown',
			version: version ? version.toString() : 'Unknown'
		});
	}
}
