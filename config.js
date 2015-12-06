module.exports = {
	master: true,
	port: 5000,
	workers: 2,
	lastRefresh: Math.floor((new Date).getTime()/1000),
	scrapeTime: '00 00 * * * *',
	scrapeTtl: 1000 * 60 * 60 * 10,
	pageSize: 50,
	dbHosts: [
		'localhost'
	],
	map: {
		'louie': 'louie-2010',
		'battlestar-galactica': 'battlestar-galactica-2003',
		'the-killing': 'the-killing-us',
		'hawaii-five-0-2010': 'hawaii-fiveo-2010',
		'the-goldbergs': 'the-goldbergs-2013',
		'vikings-us': 'vikings',
		'resurrection-us': 'resurrection',
		'golden-boy': 'golden-boy-2013',
		'the-office': 'the-office-us',
		'the-fosters': 'the-fosters-2013',
		'brooklyn-nine-nine': 'brooklyn-ninenine',
		'cracked': 'cracked-2013',
		'the-good-guys': 'the-good-guys-2010',
		'black-box': 'the-black-box',
		'hank': 'hank-2009',
		'legit': 'legit-2013',
		'power-2014': 'power',
		'scandal-us': 'scandal-2012',
		'reign': 'reign-2013'
	}
}
