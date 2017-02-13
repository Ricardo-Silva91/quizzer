'use strict';


var fs = require("fs");
var async = require("async");
var randomstring = require("randomstring");

var paths = require('./../paths');
var general_operations = require('./general_operations');

exports.answerQuestionPOST = function (args, res, next) {
    /**
     * answer a Question
     * user sends answer to current question.
     *
     * body Answer_question answer. (optional)
     * returns answer_question_res
     **/
    var examples = {};
    examples['application/json'] = {
        "result": "aeiou",
        "current_score": 123
    };
    if (Object.keys(examples).length > 0) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
        res.end();
    }
}

exports.loginPOST = function (args, res, next) {
    /**
     * login
     * user sends credentials and gets token.
     *
     * body Login_info request. (optional)
     * returns login_res
     **/
    var examples = {};
    examples['application/json'] = {
        "result": "aeiou",
        "user_type": "aeiou",
        "token": "aeiou"
    };
    if (Object.keys(examples).length > 0) {
        var username = args.body.value.user;
        var pass = args.body.value.pass;

        var filesPath = [paths.users_path];

        async.map(filesPath, function (filePath, cb) { //reading files or dir
            fs.readFile(filePath, 'utf8', cb);
        }, function (err, results) {

            var users = JSON.parse(results[0]);

            var userPos = general_operations.checkUserAndGetPosByCredentials(users, username, pass);

            if (userPos > -1) {
                users[userPos].last_access = new Date();
                users[userPos].token = randomstring.generate();

                fs.writeFile(paths.users_path, JSON.stringify(users), function (err) {
                    console.error(err)
                });

                examples = {
                    result: "success",
                    token: users[userPos].current_token
                };

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(examples, null, 2));

            }
            else {
                switch (userPos) {
                    case -1:
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({
                            result: "fail",
                            code: -1,
                            message: "user not found",
                            fields: "username"
                        }));
                        break;
                    case -2:
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({
                            result: "fail",
                            code: -2,
                            message: "wrong password",
                            fields: "pass"
                        }));
                        break;
                    default:
                        break;
                }
            }


        });
    } else {
        res.end();
    }
}

exports.questionGET = function (args, res, next) {
    /**
     * get a question
     * get a random question from server
     *
     * token String The user's token
     * returns question
     **/
    var examples = {};
    examples['application/json'] = {
        "result": "aeiou",
        "question": "aeiou",
        "answers": [{
            "text": "aeiou",
            "pic": "aeiou"
        }],
        "pic": "aeiou"
    };
    if (Object.keys(examples).length > 0) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
        res.end();
    }
}

exports.registerPOST = function (args, res, next) {
    /**
     * register
     * user sends initial info and registers.
     *
     * body Register_info request. (optional)
     * returns login_res
     **/
    var examples = {};
    examples['application/json'] = {
        "result": "aeiou",
        "user_type": "aeiou",
        "token": "aeiou"
    };
    if (Object.keys(examples).length > 0) {

        var username = args.body.value.user;
        var password = args.body.value.pass;
        var full_name = args.body.value.full_name;
        var favorite_ice_cream = args.body.value.favorite_ice_cream;
        var email = args.body.value.email;

        var filesPath = [paths.users_path, paths.local_variables_path];

        async.map(filesPath, function (filePath, cb) { //reading files or dir
            fs.readFile(filePath, 'utf8', cb);
        }, function (err, results) {

            var users = JSON.parse(results[0]);
            var local_variables = JSON.parse(results[1]);

            var userPos = general_operations.findSomethingBySomething(users, "user", username);

            if (userPos == -1) {
                local_variables.last_id = local_variables.last_id + 1;
                users = general_operations.addUser(users, username, password, full_name, favorite_ice_cream, email, local_variables.last_id);

                userPos = general_operations.checkUserAndGetPosByCredentials(users, username, password);

                users[userPos].last_access = new Date();
                users[userPos].token = randomstring.generate();
                users[userPos].user_type = "normal";

                //console.log('users:\n' + JSON.stringify(users));
                //console.log('local:\n' + JSON.stringify(local_variables));

                fs.writeFile(paths.users_path, JSON.stringify(users), function (err) {
                    console.error(err)
                });
                fs.writeFile(paths.local_variables_path, JSON.stringify(local_variables), function (err) {
                    console.error(err)
                });

                examples = {
                    result: "success",
                    user_tye: users[userPos].user_type,
                    token: users[userPos].token
                }

            }
            else {
                examples = {
                    result: "fail",
                    code: 1,
                    message: "username found",
                    fields: "username"
                }
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(examples, null, 2));

        });


    } else {
        res.end();
    }
}

