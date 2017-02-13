'use strict';

var fs = require("fs");
var async = require("async");
var randomstring = require("randomstring");

var paths = require('./../paths');
var general_operations = require('./general_operations');


exports.leaderBoardGET = function (args, res, next) {
    /**
     * get the leaderboard
     * get leaderboard with 10 best players
     *
     * returns leaderBoard
     **/
    var examples = {};
    examples['application/json'] = {
        "result": "aeiou",
        "leaderboard": [{
            "score": 123,
            "user": "aeiou"
        }]
    };
    if (Object.keys(examples).length > 0) {

        var filesPath = [paths.users_path];

        async.map(filesPath, function (filePath, cb) { //reading files or dir
            fs.readFile(filePath, 'utf8', cb);
        }, function (err, results) {

            var users = JSON.parse(results[0]);

            examples = {
                result: "success",
                leaderboard:general_operations.getLeaderBoard(users)
            };//general_operations.getLeaderBoard(users);

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(examples, null, 2));

        });


        } else {
        res.end();
    }
};

exports.rootGET = function (args, res, next) {
    /**
     * nothing
     * just to see if server is awake.
     *
     * returns String
     **/
    var examples = {};
    examples['application/json'] = "quizzer says: good evening...";
    if (Object.keys(examples).length > 0) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
        res.end();
    }
}

exports.userExistsGET = function (args, res, next) {
    /**
     * check username
     * check if username exists
     *
     * user String The username
     * returns Ok_res
     **/
    var examples = {};
    examples['application/json'] = {
        "result": "aeiou"
    };
    if (Object.keys(examples).length > 0) {

        var username = args.user.value;

        var filesPath = [paths.users_path];

        async.map(filesPath, function (filePath, cb) { //reading files or dir
            fs.readFile(filePath, 'utf8', cb);
        }, function (err, results) {

            var users = JSON.parse(results[0]);

            var userPos = general_operations.findSomethingBySomething(users, "user", username);

            if (userPos == -1) {
                examples = {
                    result: "no"
                };
            }
            else {
                examples = {
                    result: "yes"
                };
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));

        });

    } else {
        res.end();
    }
}

