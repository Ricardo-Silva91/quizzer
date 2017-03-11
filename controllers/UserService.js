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

        console.log('answerQuestionPOST: entered');

        var token = args.body.value.token;
        var answer = args.body.value.answer;

        var filesPath = [paths.users_path, paths.questions_path];

        async.map(filesPath, function (filePath, cb) { //reading files or dir
            fs.readFile(filePath, 'utf8', cb);
        }, function (err, results) {

            var users = JSON.parse(results[0]);
            var quizzes = JSON.parse(results[1]);

            var userPos = general_operations.findSomethingBySomething(users, "token", token);

            if (userPos != -1 && users[userPos].current_quiz != undefined) {

                var current_quiz = users[userPos].current_quiz;
                var last_question = current_quiz.questions.length-1;

                var quizPos = general_operations.findSomethingBySomething(quizzes, "id", current_quiz.id);

                var next_question = quizzes[quizPos].questions[last_question+1];

                if(parseInt(answer) == next_question.right_answer)
                {
                    current_quiz.questions.push(true
                    );

                    examples = {
                        result: "success",
                        answer_result: "right"
                    }
                }
                else
                {
                    current_quiz.questions.push(false
                    );

                    examples = {
                        result: "success",
                        answer_result: "wrong"
                    }
                }

                if(last_question+2 == quizzes[quizPos].questions.length)
                {
                    examples.quiz_finished = "true";

                    //console.log(current_quiz.questions);
                    users[userPos].finished_quizzes.push({id: current_quiz.id, score: general_operations.countOcsInStringArray(current_quiz.questions, true)/current_quiz.questions.length});
                    delete users[userPos].current_quiz;

                    if(users[userPos].finished_quizzes.length > 9)
                    {
                        var total=0;
                        for(var i=0; i<users[userPos].finished_quizzes.length; i++)
                        {
                            total+= users[userPos].finished_quizzes[i].score;
                        }
                        users[userPos].score = total/users[userPos].finished_quizzes.length;
                    }


                }
                else
                {
                    examples.quiz_finished = "false";
                    users[userPos].current_quiz = current_quiz;
                }

                fs.writeFile(paths.users_path, JSON.stringify(users), function (err) {
                    if (err != null) {
                        console.error(err)
                    }
                });


            }
            else {
                examples = {
                    result: "fail",
                    code: 1,
                    message: "user not found",
                    fields: "token"
                }
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(examples, null, 2));

        });
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

        console.log('loginPOST: entered');

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
                    if (err != null) {
                        console.error(err)
                    }
                });

                examples = {
                    result: "success",
                    token: users[userPos].token
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

        console.log('questionGET: entered');

        var token  = args.token.value;

        var filesPath = [paths.users_path, paths.questions_path];

        async.map(filesPath, function (filePath, cb) { //reading files or dir
            fs.readFile(filePath, 'utf8', cb);
        }, function (err, results) {

            var users = JSON.parse(results[0]);
            var quizzes = JSON.parse(results[1]);

            var userPos = general_operations.findSomethingBySomething(users, "token", token);

            if (userPos != -1 && users[userPos].current_quiz != undefined) {

                var current_quiz = users[userPos].current_quiz;
                var last_question = current_quiz.questions.length-1;

                var quizPos = general_operations.findSomethingBySomething(quizzes, "id", current_quiz.id);

                var next_question = quizzes[quizPos].questions[last_question+1];
                next_question.right_answer = "nice try";
                next_question.result = "success";

                examples = next_question;

            }
            else {
                examples = {
                    result: "fail",
                    code: 1,
                    message: "user not found",
                    fields: "token"
                }
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(examples, null, 2));

        });
    } else {
        res.end();
    }
}

exports.getQuizzesGET = function (args, res, next) {
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

        console.log('getQuizzesGET: entered');

        var token  = args.token.value;

        var filesPath = [paths.users_path, paths.questions_path];

        async.map(filesPath, function (filePath, cb) { //reading files or dir
            fs.readFile(filePath, 'utf8', cb);
        }, function (err, results) {

            var users = JSON.parse(results[0]);
            var quizzes = JSON.parse(results[1]);

            var userPos = general_operations.findSomethingBySomething(users, "token", token);

            if (userPos != -1) {


                var briefQuizzes = general_operations.briefQuizzes(quizzes);

                examples = {
                    result: "success",
                    quizzes: briefQuizzes
                }

            }
            else {
                examples = {
                    result: "fail",
                    code: 1,
                    message: "user not found",
                    fields: "token"
                }
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(examples, null, 2));

        });

    } else {
        res.end();
    }
}

exports.getPicGET = function (args, res, next) {
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

        console.log('getPicGET: entered');

        var token  = args.token.value;
        var picId = args.pic.value;

        var filesPath = [paths.users_path, paths.questions_path];

        async.map(filesPath, function (filePath, cb) { //reading files or dir
            fs.readFile(filePath, 'utf8', cb);
        }, function (err, results) {

            var users = JSON.parse(results[0]);
            var quizzes = JSON.parse(results[1]);

            var userPos = general_operations.findSomethingBySomething(users, "token", token);

            if (userPos != -1) {

                var picPath = users[userPos].current_quiz != undefined ? './data/pics/' + users[userPos].current_quiz.id + '/' + picId + '.jpg' : './data/pics/' + picId + '/999.jpg';

                //console.log(picPath);

                picPath = fs.existsSync(picPath) ? picPath : './data/pics/404.png';

                var pic = fs.readFileSync(picPath);

                res.setHeader('Content-Type', 'image/jpg');
                res.end(pic, 'binary');

            }
            else {
                examples = {
                    result: "fail",
                    code: 1,
                    message: "user not found",
                    fields: "token"
                }
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(examples, null, 2));
            }


        });

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

        console.log('registerPOST: entered');

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

exports.startQuizPOST = function (args, res, next) {
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

        console.log('startQuizPOST: entered');

        var token = args.body.value.token;
        var quiz_id = args.body.value.quiz_id;

        var filesPath = [paths.users_path, paths.questions_path];

        async.map(filesPath, function (filePath, cb) { //reading files or dir
            fs.readFile(filePath, 'utf8', cb);
        }, function (err, results) {

            var users = JSON.parse(results[0]);
            var quizzes = JSON.parse(results[1]);

            var userPos = general_operations.findSomethingBySomething(users, "token", token);

            if (userPos != -1) {
                var quizPos = general_operations.findSomethingBySomething(quizzes, "id", quiz_id);

                if (quizPos != -1) {
                    users[userPos].current_quiz = {
                        id: quiz_id,
                        questions: []
                    };

                    fs.writeFile(paths.users_path, JSON.stringify(users), function (err) {
                        if (err != null) {
                            console.error(err)
                        }
                    });

                    examples = {
                        result: "success"
                    }

                }
                else {
                    examples = {
                        result: "fail",
                        code: 1,
                        message: "quiz not found",
                        fields: "quiz_id"
                    }
                }

            }
            else {
                examples = {
                    result: "fail",
                    code: 1,
                    message: "user not found",
                    fields: "token"
                }
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(examples, null, 2));

        });


    } else {
        res.end();
    }
}

exports.getMyScoresGET = function (args, res, next) {
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

        console.log('getMyScoresGET: entered');

        var token  = args.token.value;

        var filesPath = [paths.users_path, paths.questions_path];

        async.map(filesPath, function (filePath, cb) { //reading files or dir
            fs.readFile(filePath, 'utf8', cb);
        }, function (err, results) {

            var users = JSON.parse(results[0]);
            var quizzes = JSON.parse(results[1]);

            var userPos = general_operations.findSomethingBySomething(users, "token", token);

            if (userPos != -1) {
                examples = users[userPos].finished_quizzes;
            }
            else {
                examples = {
                    result: "fail",
                    code: 1,
                    message: "user not found",
                    fields: "token"
                }
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(examples, null, 2));

        });
    } else {
        res.end();
    }
}

