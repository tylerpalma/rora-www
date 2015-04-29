var _ = require('lodash');
var promise = require('bluebird');

var app = require('../app.js');
var db = require('../models');

var usersController = module.exports;

usersController.create = function (params) {
  return db.user.findOrCreate({steamID: params.steamID}, params).then(function (user) {
    return user.dataValues;
  });
};

/*==========  ...  ==========*/

function findAllUsersWithSteamIDs (steamIDs) {
  return db.user.findAll({
    where: {steamID: steamIDs}
  }, {raw: true});
}