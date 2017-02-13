/**
 * Created by Ricardo on 09/02/2017.
 */


var fs = require("fs");
var async = require("async");

var paths = require('./../paths');
var general_operations = require('./general_operations');

var cron = require('cron');

/*
function startRefresh() {

    var filesPath = [paths.threads_path];

    async.map(filesPath, function (filePath, cb) { //reading files or dir
        fs.readFile(filePath, 'utf8', cb);
    }, function (err, results) {

        var threads = JSON.parse(results[0]);


        general_operations.getThreadsFrom4Chan(function (newThreads) {

            //console.log("threads before:\n" + threads);
            //threads = general_operations.updateThreads(threads, newThreads);

            general_operations.updateThreads(threads, newThreads, function (updatedThreads) {

                //console.log("threads:\n" + updatedThreads);

                fs.writeFile(paths.threads_path, JSON.stringify(updatedThreads), function (err) {
                    console.error(err)
                });

            });

        });


    });

    console.info('start job completed');

}
*/

//var cronJob = cron.job("*/2 * * * * *", function () {
var cronJob = cron.job("0 0 * * * *", function () {

    /*
    var filesPath = [paths.threads_path];

    async.map(filesPath, function (filePath, cb) { //reading files or dir
        fs.readFile(filePath, 'utf8', cb);
    }, function (err, results) {

        var threads = JSON.parse(results[0]);


        general_operations.getThreadsFrom4Chan(function (newThreads) {

            //console.log("threads before:\n" + threads);
            //threads = general_operations.updateThreads(threads, newThreads);

            general_operations.updateThreads(threads, newThreads, function (updatedThreads) {

                //console.log("threads:\n" + updatedThreads);

                fs.writeFile(paths.threads_path, JSON.stringify(updatedThreads), function (err) {
                    console.error(err)
                });

            });

        });


    });*/

    // perform operation e.g. GET request http.get() etc.
    console.info('cron job completed');
});


//one of - running at start
cronJob.start();
//startRefresh();



