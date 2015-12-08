var Show = require('../models/Show');
var eztv = require('./eztv');
var providers = [eztv];
var async = require('async');
var newTrakt = require('./trakt');
var config = require('../config');
var URI = require('urijs');
var fs = require('fs');

var TTL = config.scrapeTtl;

var helpers = {
    // resize image
    resizeImage: function (imageUrl, width) {
        var uri = URI(imageUrl),
            ext = uri.suffix(),
            file = uri.filename().split('.' + ext)[0];

        // Don't resize images that don't come from trakt
        //  eg. YTS Movie Covers
        if (uri.domain() !== 'trakt.us') {
            return imageUrl;
        }

        var existingIndex = 0;
        if ((existingIndex = file.search('-\\d\\d\\d$')) !== -1) {
            file = file.slice(0, existingIndex);
        }

        if (file === 'poster-dark') {
            return 'images/posterholder.png'.toString();
        } else {
            return uri.filename(file + '-' + width + '.' + ext).toString();
        }
    },

    // Source: http://stackoverflow.com/a/1714899/192024
    buildQuerystring: function (obj) {
        var str = []
        for (var p in obj)
            if (obj.hasOwnProperty(p))
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
        return str.join('&')
    },

    // Source: http://phpjs.org/functions/preg_quote/
    preg_quote: function (str, delimiter) {
        return String(str)
            .replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
    },

    // Determine if a given string matches a given pattern.
    // Inspired by PHP from Laravel 4.1
    str_is: function (pattern, value) {
        if (pattern == value) return true
        if (pattern == '*') return true

        pattern = this.preg_quote(pattern, '/')

        // Asterisks are translated into zero-or-more regular expression wildcards
        // to make it convenient to check if the strings starts with the given
        // pattern such as "library/*", making any string check convenient.
        var regex = new RegExp('^' + pattern.replace('\\*', '.*') + '$')

        return !!value.match(regex);
    },

    // Source: http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/comment-page-1/
    stringToCamel: function (str) {
        return str.replace(/(\-[a-z])/g, function ($1) {
            return $1.toUpperCase().replace('-', '')
        })
    },

    extractShowInfo: function (show, callback) {

        var that = this;
        console.log("ExtractShowInfo " + show.show + " " + show.imdb_id);
        var thisShow = {};
        var thisEpisodes = [];
        var thisEpisode = {};
        var numSeasons = 0;

        var imdb = show.imdb_id;

        if (!imdb) {
            return callback(null, show);
        }

        eztv.getAllEpisodes(show, function (err, data) {
            thisShow = data;

            if (!data) return callback(null, show);
            if (!show.show) return callback(null, show);

            console.log("Looking for " + show.show);

            var dateBased = data.dateBased;
            delete data.dateBased;

            numSeasons = Object.keys(data).length; //Subtract dateBased key

            // upate with right torrent link
            //console.log('DateBased: ' + dateBased);
            if (!dateBased) {
                async.each(Object.keys(data), function (season, cb) {
                        try {
                            newTrakt.getSeasonInfo(imdb, parseInt(season), function (err, seasonData) {
                                for (var episodeData in seasonData) {
                                    episodeData = seasonData[episodeData];
                                    if (typeof(data[season]) != 'undefined' && typeof(data[season][episodeData.number]) != 'undefined') {
                                        // hardcode the 720 for this source
                                        // TODO: Should add it from eztv_x
                                        //console.log("overview: "  + episodeData.overview);
                                        // convert to epoch!!!
                                        var firstAired = new Date(episodeData.first_aired);
                                        thisEpisode = {
                                            tvdb_id: episodeData.ids["tvdb"],
                                            season: episodeData.season,
                                            episode: episodeData.number,
                                            title: episodeData.title,
                                            overview: episodeData.overview,
                                            date_based: false,
                                            first_aired: firstAired.getTime() / 1000.0,
                                            watched: {
                                                watched: false
                                            },
                                            torrents: []
                                        };
                                        thisEpisode.torrents = data[season][episodeData.number];
                                        thisEpisode.torrents[0] = data[season][episodeData.number]["480p"] ? data[season][episodeData.number]["480p"] : data[season][episodeData.number]["720p"]; // Prevents breaking the app
                                        thisEpisodes.push(thisEpisode);
                                    }
                                }
                                cb();
                            });
                        } catch (err) {
                            console.error("Error: ", err);
                            return cb();
                        }
                    },
                    function (err, res) {
                        // Only change "lastUpdated" date if there are new episodes
                        Show.find({
                            imdb_id: imdb
                        }, function (err, show) {
                            if (err) return callback(err, null);
                            if (show.episodes != thisEpisodes) {
                                Show.update({
                                        imdb_id: imdb
                                    }, {
                                        $set: {
                                            episodes: thisEpisodes,
                                            last_updated: +new Date(),
                                            num_seasons: numSeasons
                                        }
                                    },
                                    function (err, show) {
                                        return callback(err, null);
                                    });
                            } else {
                                return callback(null, show);
                            }
                        });

                    });
            } else {
                return callback(err, null);
            }
        });
    },


    refreshDatabase: function () {
        var allShows = [];
        var that = this;
        async.each(providers, function (provider, cb) {
            provider.getAllShows(function (err, shows) {
                if (err) return console.error(err);
                allShows.push(shows);
                cb();
            });
        }, function (error) {
            // 2 process?
            async.mapLimit(allShows[0], 2, helpers.extractTrakt, function (err, results) {
                console.log("Update complete");
            });
        });
    },

    extractTrakt: function (show, callback) {
        var that = this;
        var slug = show.slug;
        try {
            console.log("Extracting " + show.show);
            Show.findOne({
                slug: slug
            }, function (err, doc) {

                if (err || !doc) {
                    console.log("New Show");
                    try {
                        newTrakt.getShowInfo(slug, function (err, data) {
                            if (err) console.log("Error [" + show.slug + "]: " + err);
                            if (!err && data) {

                                // make sure trakt returned something valid
                                if (!data.title) {
                                    return callback(null, show);
                                }

                                //  data.images.lowres = helpers.resizeImage(data.images.poster, 300)
                                //  data.images.fanart = helpers.resizeImage(data.images.fanart, 940);

                                // ok show exist
                                var newShow = new Show({
                                    _id: data.ids["imdb"],
                                    imdb_id: data.ids["imdb"],
                                    tvdb_id: data.ids["tvdb"],
                                    title: data.title,
                                    year: data.year != null ? data.year : 0,
                                    images: {
                                        'poster': data.images.poster.full != null ? data.images.poster.full : "https://upload.wikimedia.org/wikipedia/commons/6/6c/Popcorn_Time_logo.png",
                                        'fanart': data.images.fanart.full != null ? data.images.fanart.full : "https://upload.wikimedia.org/wikipedia/commons/6/6c/Popcorn_Time_logo.png",
                                        'banner': data.images.banner.full != null ? data.images.banner.full : "https://upload.wikimedia.org/wikipedia/commons/6/6c/Popcorn_Time_logo.png"
                                    },
                                    slug: slug,
                                    synopsis: data.overview,
                                    runtime: data.runtime != null ? data.runtime : 0,
                                    //TODO gonna be hardcoding
                                    rating: {
                                        hated: 100,
                                        loved: 100,
                                        votes: 100,
                                        percentage: data.rating * 10
                                    },
                                    //rating: data.ratings,
                                    genres: data.genres,
                                    country: data.country != null ? data.country : 'UNKNOWN',
                                    network: data.network != null ? data.network : 'UNKNOWN',
                                    air_day: data.airs.day,
                                    air_time: data.airs.time,
                                    status: data.status,
                                    num_seasons: 0,
                                    last_updated: 0
                                });

                                newShow.save(function (err, newDocs) {
                                    if(err){
                                        if(newShow._id == null){
                                            var dir = config.tempDir;
                                            if (!fs.existsSync(dir)){
                                                fs.mkdirSync(dir);
                                            }
                                            fs.appendFile(dir + '/showsErrorLog.txt', "Error while saving '"
                                                + slug + "', this is probably caused by an invalid valid slug\n");
                                        }
                                    }
                                    show.imdb_id = data.ids["imdb"];
                                    helpers.extractShowInfo(show, function (err, show) {
                                        return callback(err, show);
                                    });
                                });
                            } else {
                                //console.log(err);
                                return callback(null, show);
                            }
                        })
                    } catch (err) {
                        console.error("Error [" + show.slug + "]: ", err);
                        return callback(null, show);
                    }
                } else {
                    console.log("Existing Show: Checking TTL");
                    // compare with current time
                    var now = +new Date();
                    if ((now - doc.last_updated) > TTL) {
                        console.log("TTL expired, updating info");
                        show.imdb_id = doc.imdb_id;
                        //TODO: Change this to just get new rating or something
                        try {
                            newTrakt.getShowInfo(slug, function (err, data) {
                                if (!err && data) {
                                    var percentage = data.rating != null ? data.rating * 10 : 100;
                                    Show.update({
                                            _id: doc._id
                                        }, {
                                            $set: {
                                                rating: {
                                                    hated: 100,
                                                    loved: 100,
                                                    votes: 100,
                                                    percentage: percentage
                                                },
                                                status: data.status
                                            }
                                        },
                                        function (err, doc1) {
                                            helpers.extractShowInfo(show, function (err, show) {
                                                return callback(err, show);
                                            });
                                        });
                                }
                            });
                        } catch (err) {
                            console.error("Error [" + show.slug + "]: ", err);
                            return callback(err, null);
                        }
                    } else {
                        return callback(null, show);
                    }
                }
            });

        } catch (err) {
            console.error("Error [" + show.slug + "]: ", err);
            return callback(err, null);
        }

    }


};

module.exports = helpers;
