var request = require('request');
var config = require('../config');
var fs = require('fs');

var endpoint = "https://api-v2launch.trakt.tv/";
var apiKey = config.traktKey;
var offlineMsg = "Couldn't find show or API key is outdated";

exports.getShowInfo = function (slug, cb) {
    var options = {
        url: endpoint + "shows/" + slug + "?extended=full,images",
        headers: {
            'Content-Type': 'application/json',
            'trakt-api-version': 2,
            'trakt-api-key': apiKey
        }
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            if (body.length <= 1) {
                return cb(true, offlineMsg);
            } else {
                var info;
                try{
                    info = JSON.parse(body);
                } catch (err) {
                    console.error("Trakt Error: ", err);
                    return cb(err, offlineMsg);
                }
                return cb(null, info);
            }
        } else {
            if(!error && response.statusCode == 404){
                fs.appendFile(config.tempDir + '/showsErrorLog.txt', "Error while loading trakt info for show '"
                    + slug + "'\n");
                return cb(true, "Couldn't find show: " + slug);
            }
        }
        return cb(true, offlineMsg);
    });
};
exports.getSeasonInfo = function (slug, season, cb) {
    var options = {
        url: endpoint + "shows/" + slug + "/seasons/" + season + "?extended=full,images",
        headers: {
            'Content-Type': 'application/json',
            'trakt-api-version': 2,
            'trakt-api-key': apiKey
        }
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            if (body.length <= 1) {
                return cb(true, offlineMsg);
            } else {
                var info;
                try{
                    info = JSON.parse(body);
                } catch (err) {
                    console.error("Trakt Error: ", err);
                    return cb(err, offlineMsg);
                }
                return cb(null, info);
            }
        } else {
            if(!error && response.statusCode == 404){
                fs.appendFile(config.tempDir + '/showsErrorLog.txt', "Error while loading trakt info for show '"
                    + slug + "'\n");
                return cb(true, "Couldn't find show: " + slug);
            }
        }
        return cb(true, offlineMsg);
    });
};