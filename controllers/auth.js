var _ = require('lodash');
var promise = require('bluebird');

var app = require('../app.js');
var db = require('../models');

var authController = module.exports;

authController.allow = {
  registeredUsers: function (req, res, next) {
    if (!req.session.passport.user) return res.redirect("/");
    if (!req.session.passport.user.allowedAccess) return res.redirect("/beta");
    next();
  },
  admins: function (req, res, next) {

    if (!res.locals.admin) return denyAccess(req, res);

    res.locals.query = req.query;
    next();
  },
  serverAdmins: function (req, res, next) {

    if (!res.locals.serverAdmin) return denyAccess(req, res);

    res.locals.query = req.query;
    next();
  }
};

authController.setLocals = {
  admin: function (req, res, next) {
    db.user.findAll({where: {admin: true}}, {raw: true}).then(function (admins) {
      var adminSteamIDs = _.map(admins, 'steamID');

      if (adminSteamIDs.indexOf(req.session.passport.user.steamID) >= 0) {
        res.locals.admin = true;
        return _.find(admins, {'steamID': req.session.passport.user.steamID});
      }

      throw new Error("Not an admin");
    }).then(function (admin) {

      if (admin.serverAdmin) {
        res.locals.serverAdmin = true;
        return next();
      }

      throw new Error("Not a server admin");
    }).catch(function (e) {
      console.log(e);
      next();
    });
  }
};

function denyAccess (req, res) {
  console.log('Access denied!');
  req.flash('error', 'You are not authorized to access that endpoint');
  res.redirect('/');
}