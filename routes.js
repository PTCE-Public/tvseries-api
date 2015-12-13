var controllers = require('./controllers/load.js');

// Express Routing
module.exports = function(app) {
	app.get('/', controllers.index.getIndex);

	app.get('/shows', controllers.shows.getShows);
	app.get('/shows/:page', controllers.shows.getPage);
	app.get('/show/:id', controllers.shows.getShow);
	
	app.get('/shows/search/:search', controllers.shows.search);
	app.get('/shows/search/:search/:page', controllers.shows.searchPage);

	app.get('/shows/update/:since', controllers.shows.getSince);
	app.get('/shows/update/:since/:page', controllers.shows.getSincePage);
	app.get('/shows/last_updated', controllers.shows.getLastUpdated);
	app.get('/shows/last_updated/:page', controllers.shows.getLastUpdatedPage);

	app.get('/movie/:id/rating', controllers.movies.getMovieRating);
};