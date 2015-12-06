var Show = require('../models/Show');
var config = require('../config.js');

module.exports = {
    getShows: function (req, res) {
        // we get how many elements we have
        // then we return the page array
        Show.count({}, function (err, count) {
            var pages = Math.round(count / config.pageSize);
            var docs = [];

            for (var i = 1; i < pages + 1; i++)
                docs.push("shows/" + i);

            res.json(docs);
        });
    },
    getPage: function (req, res) {
        var page = req.params.page - 1;
        var offset = page * config.pageSize;

        // support older version
        if (req.params.page == 'all') {

            Show.find({num_seasons: {$gt: 0}}).sort({title: -1}).exec(function (err, docs) {
                res.json(docs);
            });

        } else {

            var query = {num_seasons: {$gt: 0}};
            var data = req.query;

            if (!data.order)
                data.order = -1;

            var sort = {"rating.votes": data.order, "rating.percentage": data.order}
            // filter elements

            if (data.keywords) {
                var words = data.keywords.split(" ");
                var regex = data.keywords.toLowerCase();
                if (words.length > 1) {
                    var regex = "^";
                    for (var w in words) {
                        regex += "(?=.*\\b" + RegExp.escape(words[w].toLowerCase()) + "\\b)";
                    }
                    regex += ".+";
                }
                query = {title: new RegExp(regex, "gi"), num_seasons: {$gt: 0}};
            }

            if (data.sort) {
                if (data.sort == "year") sort = {year: data.order};
                if (data.sort == "updated") sort = {"episodes.first_aired": data.order};
                if (data.sort == "name") sort = {title: (data.order * -1)};
            }

            if (data.genre && data.genre != "All") {
                query = {genres: data.genre, num_seasons: {$gt: 0}}
            }

            // paging
            Show.find(query, {
                _id: 1,
                imdb_id: 1,
                tvdb_id: 1,
                title: 1,
                year: 1,
                images: 1,
                slug: 1,
                num_seasons: 1,
                last_updated: 1,
                ratings: 1
            }).sort(sort).skip(offset).limit(config.pageSize).exec(function (err, docs) {
                res.json(docs);
            });

        }
    },
    getShow: function (req, res) {
        Show.find({imdb_id: req.params.id}).limit(1).exec(function (err, docs) {
            if (Array.isArray(docs)) docs = docs[0];
            res.json(docs);
        });
    },
    search: function (req, res) {
        var keywords = new RegExp(RegExp.escape(req.params.search.toLowerCase()), "gi");
        Show.find({
            title: keywords,
            num_seasons: {$gt: 0}
        }).sort({title: -1}).limit(config.pageSize).exec(function (err, docs) {
            res.json(docs);
        });
    },
    searchPage: function (req, res) {
        var page = req.params.page - 1;
        var offset = page * config.pageSize;
        var keywords = new RegExp(RegExp.escape(req.params.search.toLowerCase()), "gi");

        Show.find({
            title: keywords,
            num_seasons: {$gt: 0}
        }).sort({title: -1}).skip(offset).limit(config.pageSize).exec(function (err, docs) {
            res.json(docs);
        });
    },
    getSince: function (req, res) {
        var since = req.params.since;
        if (req.query.full) {
            Show.find({last_updated: {$gt: parseInt(since)}, num_seasons: {$gt: 0}}, function (err, docs) {
                res.json(docs);
            });
        } else {
            Show.count({last_updated: {$gt: parseInt(since)}, num_seasons: {$gt: 0}}, function (err, count) {
                // how many page?
                var pages = Math.round(count / config.pageSize);

                var docs = [];
                for (var i = 1; i < pages + 1; i++)
                    docs.push("shows/update/" + since + "/" + i);

                res.json(docs);
            });
        }
    },
    getSincePage: function (req, res) {
        var page = req.params.page - 1;
        var offset = page * config.pageSize;
        var since = req.params.since;

        Show.find({
            last_updated: {$gt: parseInt(since)},
            num_seasons: {$gt: 0}
        }).sort({title: -1}).skip(offset).limit(config.pageSize).exec(function (err, docs) {
            res.json(docs);
        });
    },
    getLastUpdated: function (req, res) {
        Show.find({num_seasons: {$gt: 0}}).sort({last_updated: -1}).limit(config.pageSize).exec(function (err, docs) {
            res.json(docs);
        });
    },
    getLastUpdatedPage: function (req, res) {
        var page = req.params.page - 1;
        var offset = page * config.pageSize;
        Show.find({num_seasons: {$gt: 0}}).sort({last_updated: -1}).skip(offset).limit(config.pageSize).exec(function (err, docs) {
            res.json(docs);
        });
    },
}
