/*************************
**  Modules     **
**************************/

var request =   require('request');
var cheerio =   require('cheerio');
var moment  =   require('moment');
var config  =   require('../config');

/*************************
**  Variables   **
**************************/

var BASE_URL    =   "https://eztv.ag";
var SHOWLIST    =   "/showlist/";
var SHOWS   =   "/shows/";

var eztv_map = require('../config').map;

exports.getAllShows =   function(cb) {
    if(cb == null) return;
        request(BASE_URL + SHOWLIST, function(err, res, html){

        if(err) return (err, null);

        var $ = cheerio.load(html);
        var title, show;
        var allShows = [];

        $('.thread_link').each(function(){
            var entry = $(this);
            var show = entry.text();
            var id = entry.attr('href').match(/\/shows\/(.*)\/(.*)\//)[1];
            var slug = entry.attr('href').match(/\/shows\/(.*)\/(.*)\//)[2];
            slug = slug in eztv_map ? eztv_map[slug] : slug;
            allShows.push({show: show, id: id, slug: slug});
        });

        return cb(null, allShows);
        });
};

exports.getShowDetails = function(show, cb) {
    if(cb == null) return;

    request(BASE_URL + SHOWS + show.id + "/"+ show.slug +"/", function(err, res, html) {
        if(err) return cb(err, null);

        var $ = cheerio.load(html);

        var imdb;
        try {
            imdb = $("div[itemtype='http://schema.org/AggregateRating']").children('a').first().attr('href').match(/\/title\/(.*)\//)[1];
        } catch (err){
            console.log("IMDB code missing for " + show.show);
            return cb(true, null);
        }

        return cb(null, imdb);
    });
};

exports.getAllEpisodes = function(data, cb) {
    if(cb == null) return;
    var episodes = {};

    request.get(BASE_URL + SHOWS + data.id + "/"+ data.slug +"/", function (err, res, html) {
        if(err) return cb(err, null);

        var $ = cheerio.load(html);

        var show_rows = $('tr.forum_header_border[name="hover"]').filter(function() {
            episode_rows = $(this).children('.forum_thread_post');
            if(episode_rows.length > 0) {
                var title = $(this).children('td').eq(1).text();

                return title.indexOf("-CTU") <= -1;
            }
            return false;
        });

        if(show_rows.length === 0) return cb("Show Not Found", null);

        show_rows.each(function() {
            var entry = $(this);
            var title = entry.children('td').eq(1).text().replace('x264', ''); // temp fix
            //In order to get the android version work we need to have a magnet link not a torrent file
            var magnet = entry.children('td').eq(2).children('a').first().attr('href');
            if(magnet == null) return true;
            if(magnet.toUpperCase() === "javascript:void(0);".toUpperCase()) magnet = entry.children('td').eq(2).children('a').eq(1).attr('href');
            if(endsWith(magnet, ".torrent")) magnet = entry.children('td').eq(2).children('a').eq(2).attr('href');
            if(endsWith(magnet, ".torrent")) magnet = entry.children('td').eq(2).children('a').eq(3).attr('href');
            if(magnet == null) return true;

            var matcher = title.match(/S?0*(\d+)?[xE]0*(\d+)/);
            var quality = title.match(/(\d{3,4})p/) ? title.match(/(\d{3,4})p/)[0] : "480p";
            if(matcher) {
                var season = parseInt(matcher[1], 10);
                var episode = parseInt(matcher[2], 10);
                var torrent = {};
                torrent.url = magnet;
                torrent.seeds = 0;
                torrent.peers = 0;
                if(!episodes[season]) episodes[season] = {};
                if(!episodes[season][episode]) episodes[season][episode] = {};
                if(!episodes[season][episode][quality] || title.toLowerCase().indexOf("repack") > -1)
                    episodes[season][episode][quality] = torrent;
                episodes.dateBased = false;
            }
            else {
                matcher = title.match(/(\d{4}) (\d{2} \d{2})/); // Date based TV Shows
                var quality = title.match(/(\d{3,4})p/) ? title.match(/(\d{3,4})p/)[0] : "480p";
                if(matcher) {
                    var season = matcher[1]; // Season : 2014
                    var episode = matcher[2].replace(" ", "/"); //Episode : 04/06
                    var torrent = {};
                    torrent.url = magnet;
                    torrent.seeds = 0;
                    torrent.peers = 0;
                    if(!episodes[season]) episodes[season] = {};
                    if(!episodes[season][episode]) episodes[season][episode] = {};
                    if(!episodes[season][episode][quality] || title.toLowerCase().indexOf("repack") > -1)
                        episodes[season][episode][quality] = torrent;
                    episodes.dateBased = true;
                }
            }
        });
        return cb(null, episodes);
    });
};

function endsWith(str, suffix) {
    if(str == null || suffix == null) return false;
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}