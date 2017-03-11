/**
 * Created by Ricardo on 09/02/2017.
 */

var request = require("request");


exports.getUserPosByToken = function (users, token) {
    var result = -1;

    for (var i = 0; i < users.length; i++) {

        //console.log('private getUserPosByToken: checking user ' + users[i].username);
        //console.log('private getUserPosByToken: user ' + users[i].username + ' token ' + users[i].current_token);

        if (users[i].current_token == token) {
            console.log('private getUserPosByToken: user found.');
            result = i;
            break;
        }
    }
    return result;

};

exports.checkUserAndGetPosByCredentials = function (users, username, pass) {
    var result = -1;

    for (var i = 0; i < users.length; i++) {

        if (users[i].user == username) {
            if (users[i].pass == pass) {
                result = i;
            }
            else {
                result = -2;
            }

            break;
        }

    }
    return result;

};

exports.getThreadPosById = function (threads, threadId) {
    var result = -1;

    for (var i = 0; i < threads.length; i++) {

        //console.log('private getUserPosByToken: checking user ' + users[i].username);
        //console.log('private getUserPosByToken: user ' + users[i].username + ' token ' + users[i].current_token);

        if (threads[i].no == threadId) {
            console.log('private getThreadPosById: thread found.');
            result = i;
            break;
        }
    }
    return result;

};

exports.getThreadPosByDate = function (threads, date) {
    var result = -1;

    //console.log("creation date:\n" + new Date(threads[0].now).getTime());
    //console.log("date:\n" + date);

    for (var i = threads.length - 1; i >= 0; i--) {

        //console.log('private getUserPosByToken: checking user ' + users[i].username);
        //console.log('private getUserPosByToken: user ' + users[i].username + ' token ' + users[i].current_token);

        var creationDate = new Date(threads[i].now).getTime();
        //console.log("creation date:\n" + creationDate);
        //console.log("date:\n" + date);

        if (creationDate < date) {
            console.log('private getThreadPosByDate: older thread reached.');

            if (i != threads.length - 1) {
                result = i + 1;
            }
            break;
        }
    }

    if (i == -1) {
        result = 0;
    }

    return result;

};

exports.filterThreadByKeywords = function (thread, keywords) {

    var filteredThread = [];

    for (var i = 0; i < thread.posts.length; i++) {
        //console.log("post:\n" + thread.posts[i].com);
        if (searchTextForWords(thread.posts[i].com, keywords) == true) {
            //console.log("found one");
            filteredThread.push(thread.posts[i]);
        }
    }

    //console.log(filteredThread);
    return filteredThread;

};

exports.getThreadsFrom4Chan = function (cb) {

    console.log("private method getThreadsFrom4Chan entered");
    var host_url = chanUrl + "catalog.json";
    console.log("private method getThreadsFrom4Chan host url: " + host_url);


    request({
        url: host_url,
        method: "GET",
        json: true
    }, function (error, response, body) {
        if (response != null) {
            if (!error && response.statusCode === 200) {
                //cb(body);
                //console.log(body);

                var shareThreads = filterForShareThreads(body);
                //console.log(shareThreads);

                cb(shareThreads);
            }
            else {

                console.log("error.");
                cb("no_ack");
            }
        }
        else {

            console.log("no res");
            cb("no_ack");
        }

    })
};

exports.updateThreads = function (threads, newThreads, cb) {

    console.log("private method updateThreads entered");

    var threadId, threadPos;

    for (var i = 0; i < newThreads.length; i++) {
        threadId = newThreads[i].no;

        threadPos = searchForIdInRecentThreads(threads, threadId, howManyThreads);

        if (threadPos == -1) {

            console.log("private method updateThreads: new thread");

            threads.push(newThreads[i]);

            getThreadPosts(threadId, function (posts) {
                //console.log(threads);
                threads[threads.length - 1].posts = posts;
                cb(threads);
            });

        }
        else {
            console.log("private method updateThreads: old thread - updating");

            getThreadPosts(threadId, function (posts) {
                threads[threadPos].posts = posts;
                //console.log(threads);
                cb(threads);

            });
        }
    }


};

exports.briefThreads = function (threads) {

    console.log("private method briefThreads entered");

    for (var i = 0; i < threads.length; i++) {
        delete threads[i].last_replies;
        delete threads[i].posts;
    }

    return threads;

};

exports.findSomethingBySomething = function (list, something, toFind) {

    var result = -1;

    for (var i = 0; i < list.length; i++) {

        //console.log('private getUserPosByToken: checking user ' + users[i].username);
        //console.log('private getUserPosByToken: user ' + users[i].username + ' token ' + users[i].current_token);

        if((typeof toFind) == "string")
        {
            //console.log('private findSomethingBySomething: it\'s a string.');
            toFind = toFind.toLowerCase();
            list[i][something] = list[i][something].toLowerCase();
            //console.log('private findSomethingBySomething: comparing ' + toFind + ' ' + list[i][something] +'.')
        }

        if (list[i][something] == toFind) {
            console.log('private findSomethingBySomething: found.');
            result = i;
            break;
        }
    }
    return result;

};

exports.keywordsExists = function (keywords, newKey) {

    var result = false;

    for (var i = 0; i < keywords.length; i++) {

        //console.log('private getUserPosByToken: checking user ' + users[i].username);
        //console.log('private getUserPosByToken: user ' + users[i].username + ' token ' + users[i].current_token);

        if (keywords[i] == newKey) {
            console.log('private keywordsExists: exists.');
            result = true;
            break;
        }
    }
    return result;

};

exports.getLeaderBoard = function (users) {

    var prop = 'score';

    users = users.sort(function (a, b) {
        return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
    });

    var newUsers = [];

    for (var i=0; i<users.length && i<10; i++)
    {
        newUsers.push({
            user: users[i].user,
            score: users[i].score
        })
    }

    return newUsers;

};

exports.addUser = function (users, username, password, full_name, favorite_ice_cream, email, id) {

    var newUser = {
        user: username,
        pass: password,
        full_name: full_name,
        favorite_ice_cream: favorite_ice_cream,
        email: email,
        score: 0,
        id: id,
        finished_quizzes: []
    };

    users.push(newUser);

    return users;

};

exports.briefQuizzes = function (quizzes) {

    var briefQuizzes = [];

    for (var quiz in quizzes)
    {
        briefQuizzes.push({
            id: 0,
            name: "test quizz",
            description: "the test quiz"
        })
    }

    return briefQuizzes;

};

exports.countOcs = function (list, element, oc) {

    var numberOfOcs = 0;

    for(var i in list)
    {
        if(i[element] == oc)
        {
            numberOfOcs++;
        }
    }

    return numberOfOcs;

}

exports.countOcsInStringArray = function (list, oc) {

    var numberOfOcs = 0;

    for(var i in list)
    {
        if(list[i] == oc)
        {
            numberOfOcs++;
        }
    }

    //console.log("number of ocs: " + numberOfOcs);
    return numberOfOcs;

}


/************ Private Methods/Variables ***************/

var chanUrl = "https://a.4cdn.org/mu/";
var shareThread_identifiers = ["sharethread"];
var howManyThreads = 5;

function searchTextForWords(text, keywords) {

    var result = false;

    for (var i = 0; i < keywords.length; i++) {
        if (text.toLowerCase().indexOf(keywords[i]) > -1) {
            result = true;
            break;
        }
    }

    return result;

};

function filterForShareThreads(pages) {

    var result = [];
    var threads, thread;

    //console.log(pages[0].threads[0].com);

    for (var i = 0; i < pages.length; i++) {
        threads = pages[i].threads;
        for (var j = 0; j < threads.length; j++) {
            //console.log(threads[j].com);
            thread = threads[j];
            //if (i == 0 && j == 0) {

            //console.log(i + ' ' + j + ':\n' + thread.sub);

            if (thread.sub != undefined && searchTextForWords(thread.sub, shareThread_identifiers) == true) {
                result.push(thread);
            }
            //}
            /*
             }*/
        }
    }

    return result;

}

function searchForIdInRecentThreads(threads, id, howMany) {

    var result = -1;

    for (var i = threads.length - 1; (i > threads.length - howMany) && i > 0; i--) {
        if (threads[i].no == id) {
            result = i;
            break;
        }
    }

    return result;

}

function getThreadPosts(threadId, cb) {
    console.log("private method getThreadPosts entered");
    var host_url = chanUrl + "thread/" + threadId + ".json";
    console.log("private method getThreadPosts host url: " + host_url);


    request({
        url: host_url,
        method: "GET",
        json: true
    }, function (error, response, body) {
        if (response != null) {
            if (!error && response.statusCode === 200) {
                //cb(body);
                //console.log(body);


                //console.log(body.posts);

                cb(body.posts);
            }
            else {

                console.log("error.");
                cb("no_ack");
            }
        }
        else {

            console.log("no res");
            cb("no_ack");
        }

    })
}