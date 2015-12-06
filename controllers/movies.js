var Rating = require('../models/Rating');
var config = require('../config.js');
var request = require('request');

module.exports = {
	getMovieRating: function(req, res) {
    Rating.findOne({_id: req.params.id}, {_id: 0, rt: 1}, function (err, doc) {
      if(err || !doc) {
        request('http://api.rottentomatoes.com/api/public/v1.0/movie_alias.json', {
          json: true,
          qs: {
            id: req.params.id.match(/tt([0-9]*)/)[1],
            type: 'imdb',
            apikey: '6psypq3q5u3wf9f2be38t5fd'
          },
          headers: {
            'X-Originating-Ip': req.ip
          }
        },
        function(err, response, body) {
          var rating = new Rating;
          rating._id = req.params.id;
          rating.rt = body.ratings;
          rating.save();

          res.json({
            rt: body.ratings
          });
        })
      } else {
        res.json(doc);
      }
    })
	}
}
