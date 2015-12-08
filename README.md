Popcorn API
=========

Popcorn Time API is developed to make it easier for anyone to create their own versions of [Popcorn Time](http://popcorntime.io). It contains:

  - Metadata about TV Shows and individual episodes (taken from Trakt)
  - Multiple quality magnet links for every episode 
  - Ability to easily filter content to the users' content

Installation
============

Install NodeJS, MongoDB and Git
`sudo apt-get install -y node mongodb git`

Setup MongoDB dirs
`mkdir -p /data/db`

Clone the repo
`git clone https://popcorncouzx5cjn.onion.to/PTCE/tvseries-api.git`

Install dependencies
`cd tvseries-api`
`npm install`

Fire it up!
`node index`

Hint: the default port os set to `5000` currently, but can be changed in the `config.js` file.


Routes
======

The API contains the following 'routes' which produce the example output

`show/:imdb_id` - This returns all info and episodes for a particular show. Useful for the "show details" page in your app

**Example**

`https://<URL HERE>/show/tt1475582` returns the following:

```
{
    _id: "tt1475582",
    air_day: "Sunday",
    air_time: "8:30pm",
    country: "United Kingdom",
    images: {
    poster: "http://slurm.trakt.us/images/posters/178.11.jpg",
    fanart: "http://slurm.trakt.us/images/fanart/178.11.jpg",
    banner: "http://slurm.trakt.us/images/banners/178.11.jpg"
    },
    imdb_id: "tt1475582",
    last_updated: 1406509936365,
    network: "BBC One",
    num_seasons: 3,
    rating: {
    hated: 157,
    loved: 12791,
    votes: 12948,
    percentage: 93
    },
    runtime: "90",
    slug: "sherlock",
    status: "Continuing",
    synopsis: "Sherlock depicts 'consulting detective' Sherlock Holmes, who assists the Metropolitan Police Service, primarily D.I. Greg Lestrade, in solving various crimes. Holmes is assisted by his flatmate, Dr. John Watson.",
    title: "Sherlock",
    tvdb_id: "176941",
    year: "2010",
    episodes: [
        {"torrents":
            {
                "0":
                {
                    "peers":0,
                    "seeds":0,
                    "url":"magnet:?xt=urn:btih:T6Y4FG35S54U3CWSV2OPAXRQVXHZJ4WV&dn=Sherlock.2x01.A.Scandal.In.Belgravia.HDTV.XviD-FoV&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.publicbt.com:80&tr=udp://tracker.istole.it:80&tr=udp://open.demonii.com:80&tr=udp://tracker.coppersurfer.tk:80"
                },
                "480p":
                {
                    "peers":0,
                    "seeds":0,
                    "url":"magnet:?xt=urn:btih:T6Y4FG35S54U3CWSV2OPAXRQVXHZJ4WV&dn=Sherlock.2x01.A.Scandal.In.Belgravia.HDTV.XviD-FoV&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.publicbt.com:80&tr=udp://tracker.istole.it:80&tr=udp://open.demonii.com:80&tr=udp://tracker.coppersurfer.tk:80"},
                "720p":
                {
                    "peers":0,
                    "seeds":0,
                    "url":"magnet:?xt=urn:btih:GHB4ZITTAO3AMXKNQ4ODBHMFT426NHYU&dn=Sherlock.2x01.A.Scandal.In.Belgravia.720p.HDTV.x264-FoV&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.publicbt.com:80&tr=udp://tracker.istole.it:80&tr=udp://open.demonii.com:80&tr=udp://tracker.coppersurfer.tk:80"
                }
            },
        "first_aired":1325449800,
        "overview":"Compromising photographs and a case of blackmail threaten the very heart of the British establishment, but for Sherlock and John the game is on in more ways than one as they find themselves battling international terrorism, rogue CIA agents, and a secret conspiracy involving the British government. This case will cast a darker shadow over their lives than they could ever imagine, as the great detective begins a long duel of wits with an antagonist as cold and ruthless and brilliant as himself: to Sherlock Holmes, Irene Adler will always be THE woman.",
        "title":"A Scandal in Belgravia",
        "episode":1,
        "season":2,
        "tvdb_id":4103396
        }
        ......
    ],
    genres: [
    "Action",
    "Adventure",
    "Drama",
    "Crime",
    "Mystery",
    "Comedy",
    "Thriller"
    ]
}

```



`shows/` This returns the number of pages available to list 50 shows at a time (used for pagination etc)

`shows/:page` this retuns a list of 50 shows with metadata

**Example**

`https://<URL HERE>/shows/1`

```
[
    {
        _id: "tt0944947",
        images: {
            poster: "http://slurm.trakt.us/images/posters/1395.79.jpg",
            fanart: "http://slurm.trakt.us/images/fanart/1395.79.jpg",
            banner: "http://slurm.trakt.us/images/banners/1395.79.jpg"
        },
        imdb_id: "tt0944947",
        last_updated: 1406509464197,
        num_seasons: 4,
        slug: "game-of-thrones",
        title: "Game of Thrones",
        tvdb_id: "121361",
        year: "2011"
    },
    {
        _id: "tt0903747",
        images: {
            poster: "http://slurm.trakt.us/images/posters/126.54.jpg",
            fanart: "http://slurm.trakt.us/images/fanart/126.54.jpg",
            banner: "http://slurm.trakt.us/images/banners/126.54.jpg"
        },
        imdb_id: "tt0903747",
        last_updated: 1406509278746,
        num_seasons: 5,
        slug: "breaking-bad",
        title: "Breaking Bad",
        tvdb_id: "81189",
        year: "2008"
    },
    {
        _id: "tt0898266",
        images: {
            poster: "http://slurm.trakt.us/images/posters/34.69.jpg",
            fanart: "http://slurm.trakt.us/images/fanart/34.69.jpg",
            banner: "http://slurm.trakt.us/images/banners/34.69.jpg"
        },
        imdb_id: "tt0898266",
        last_updated: 1406509254635,
        num_seasons: 7,
        slug: "the-big-bang-theory",
        title: "The Big Bang Theory",
        tvdb_id: "80379",
        year: "2007"
    },
    {
        _id: "tt1520211",
        images: {
            poster: "http://slurm.trakt.us/images/posters/124.39.jpg",
            fanart: "http://slurm.trakt.us/images/fanart/124.39.jpg",
            banner: "http://slurm.trakt.us/images/banners/124.39.jpg"
        },
        imdb_id: "tt1520211",
        last_updated: 1406510162804,
        num_seasons: 4,
        slug: "the-walking-dead",
        title: "The Walking Dead",
        tvdb_id: "153021",
        year: "2010"
    },
    ...
]
```

**Sorting**

This route can be sorting and filtered with the following `query string

`?sort=`

Possible options are
- Name (Sort by TV Show title)
- Year (Year the TV Show first aired)
- Updated (Sort by the most recently aired episode date)
 
You can change the order of the sort by adding `&order=1` or `&order=-1` to the query string

**Filtering**
You can filter shows by keyowrds using the following

`shows/1?keywords=` (Again the 1 is used for pagination)
