module.exports = {
	master: true,
	port: 5000,
	workers: 2,
	lastRefresh: Math.floor((new Date).getTime()/1000),
	scrapeTime: '00 00 */2 * * *',
	scrapeTtl: 1000 * 60 * 60 * 10,
	pageSize: 50,
	tempDir: './tmp',
	traktKey: '70c43f8f4c0de74a33ac1e66b6067f11d14ad13e33cd4ebd08860ba8be014907',
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
		'reign': 'reign-2013',

		'10-oclock-live': '10-o-clock-live',
		'2010-vancouver-winter-olympics': 'vancouver-2010-olympic-winter-games-feature-presentation-1969',
		'marvels-agent-carter': 'marvel-s-agent-carter',
		'marvels-agents-of-shield': 'marvel-s-agents-of-s-h-i-e-l-d',
		'marvels-avengers-assemble': 'marvel-s-avengers-assemble',
		'marvels-daredevil': 'marvel-s-daredevil',
		'marvels-guardians-of-the-galaxy': 'marvel-s-guardians-of-the-galaxy'
	}
};
