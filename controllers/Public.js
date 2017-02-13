'use strict';

var url = require('url');

var Public = require('./PublicService');

module.exports.leaderBoardGET = function leaderBoardGET (req, res, next) {
  Public.leaderBoardGET(req.swagger.params, res, next);
};

module.exports.rootGET = function rootGET (req, res, next) {
  Public.rootGET(req.swagger.params, res, next);
};

module.exports.userExistsGET = function userExistsGET (req, res, next) {
  Public.userExistsGET(req.swagger.params, res, next);
};
