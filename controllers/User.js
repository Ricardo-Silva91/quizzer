'use strict';

var url = require('url');

var User = require('./UserService');

module.exports.answerQuestionPOST = function answerQuestionPOST (req, res, next) {
  User.answerQuestionPOST(req.swagger.params, res, next);
};

module.exports.loginPOST = function loginPOST (req, res, next) {
  User.loginPOST(req.swagger.params, res, next);
};

module.exports.questionGET = function questionGET (req, res, next) {
  User.questionGET(req.swagger.params, res, next);
};

module.exports.registerPOST = function registerPOST (req, res, next) {
  User.registerPOST(req.swagger.params, res, next);
};
