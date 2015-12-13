var config = require("../config");
var fs = require('fs');
var Show = require('../models/Show');

module.exports = {
	getIndex: function(req, res) {
		getMoreInfo(function (shows, updated, status, version){
			res.json({
				status: status,
				uptime: process.uptime() | 0,
				server: config.serverName,
				totalShows: shows,
				updated: updated,
				version: version
			});
		});
	}
};

function getMoreInfo(callback){
	var shows = "Unknown";
	var updated = "Unknown";
	var status = "Idle";
	var version = "Unknown";
	var dir = config.tempDir;
	var packageJSON = JSON.parse(fs.readFileSync('package.json', 'utf8'));
	var lastUpdatedJSON = JSON.parse(fs.readFileSync(dir + '/lastUpdated.json', 'utf8'));
	var statusJSON = JSON.parse(fs.readFileSync(dir + '/status.json', 'utf8'));
	updated = lastUpdatedJSON.lastUpdated != null ? lastUpdatedJSON.lastUpdated : "Unknown";
	status = statusJSON.status != null ? statusJSON.status : "Idle";
	version = packageJSON.version != null ? packageJSON.version : "Unknown";
	Show.count({}, function (err, count) {
		if(!err) shows = count;
		return callback(shows, updated, status, version);
	});
}