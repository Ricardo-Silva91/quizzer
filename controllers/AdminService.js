'use strict';

exports.makeUserAdminPOST = function(args, res, next) {
  /**
   * make a user admin
   * give an user admin privileges
   *
   * body MakeUserAdmin_req request. (optional)
   * returns Ok_res
   **/
  var examples = {};
  examples['application/json'] = {
  "result" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.usersGET = function(args, res, next) {
  /**
   * list users
   * check list users and their information
   *
   * token String The user's token
   * returns usersInfo
   **/
  var examples = {};
  examples['application/json'] = {
  "result" : "aeiou",
  "users" : [ {
    "last_access" : "aeiou",
    "score" : 123,
    "full_name" : "aeiou",
    "favorite_ice_cream" : "aeiou",
    "user" : "aeiou",
    "email" : "aeiou"
  } ]
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

