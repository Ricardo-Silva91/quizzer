'use strict';

var url = require('url');

var Admin = require('./AdminService');

module.exports.makeUserAdminPOST = function makeUserAdminPOST (req, res, next) {
  Admin.makeUserAdminPOST(req.swagger.params, res, next);
};

module.exports.usersGET = function usersGET (req, res, next) {
  Admin.usersGET(req.swagger.params, res, next);
};
