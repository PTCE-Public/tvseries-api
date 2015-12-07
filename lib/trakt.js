var request = require('request');
var config = require('../config');

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
                return cb(error, offlineMsg);
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
            return cb(error, offlineMsg);
        }
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
                return cb(error, offlineMsg);
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
            return cb(error, offlineMsg);
        }
    });
};