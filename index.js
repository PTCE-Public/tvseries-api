var cluster = require('cluster')
  , app = require('express')()
  , cpuCount = require('os').cpus().length
  , fs = require('fs');

// settings
var config = require('./config.js');
// config
require('./setup.js')(config, app);
// routes
require('./routes.js')(app);

if(cluster.isMaster) {

    // Fork the child threads
    for (var i = 0; i < Math.min(cpuCount, config.workers); i++) {
        cluster.fork();
    }

    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died, spinning up another!');
        cluster.fork();
    });

    var dir = config.tempDir;
    if (fs.existsSync(dir)){
        try {
            fs.unlinkSync(dir + "/showsErrorLog.txt", function (){})
        } catch (err){}
    } else fs.mkdirSync(dir);

    fs.writeFile(dir + '/lastUpdated.json', JSON.stringify({lastUpdated: Math.floor((new Date).getTime()/1000)}), function (err) {});
    fs.writeFile(dir + '/status.json', JSON.stringify({status: 'Starting Up'}), function (err) {});

    // Is this the master API server? If so scrape
    if(config.master) {
        var domain = require('domain');
        var scope = domain.create();

        scope.run(function() {
            var helpers = require('./lib/helpers');
            // Launch the eztv scraper
            try {
                var CronJob = require('cron').CronJob;
                var job = new CronJob(config.scrapeTime, 
                    function(){
                        helpers.refreshDatabase();
                    }, function () {
                        // This function is executed when the job stops
                    },
                    true
                );
                console.log("Cron job started");
            } catch(ex) {
                console.log("Cron pattern not valid");
            }
            // Start extraction right now
            helpers.refreshDatabase();
        });

        scope.on('error', function(err) {
            console.log("Error:", err);
        })
    }

} else {
    app.listen(config.port);
}