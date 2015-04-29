var express = require('express');
var router = express.Router();
var passport = require('passport');
var SteamStrategy = require('passport-steam').Strategy;
var controller = require('../controllers');
var db = require('../models');
var _ = require('lodash');


passport.use(new SteamStrategy({
  returnURL: 'http://localhost:3000/auth/steam/return',
  realm: 'http://localhost:3000',
  keyOwner: 'spacejamz',
  apiKey: 'DA17DC80DBB1CD69460F44A7336C6C2C'
},
function (id, profile, done) {
  console.log('id: ' + id);
  console.log('profile: ' + JSON.stringify(profile, null, 2));

  var data = profile._json;
  var params = {
    steamID: data.steamid,
    steamPrimaryClanID: data.primaryclanid,
    steamUserName: data.personaname,
    steamRealName: data.realname,
    steamLocCountryCode: data.loccountrycode,
    steamLocStateCode: data.locstatecode,
    steamLocCityID: data.loccityid,
    steamAvatar: data.avatar,
    steamAvatarMedium: data.avatarmedium,
    steamAvatarFull: data.avatarfull
  };

  controllers.user.create(params).then(function (user, created) {
    done(null, user);
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user);
 });

passport.deserializeUser(function(userID, done) {
  db.user.find(userID).done(function(err, user){
    if (err) return done(err, null);

    done(null, user);
  });
});



// =========
// Routes
// =========

router.get('/steam', passport.authenticate('steam', {failureRedirect: '/login'}), function(req, res) {
  res.redirect('/');
});

router.get('/steam/return', passport.authenticate('steam', {failureRedirect: '/login' }), function(req, res) {
  res.redirect('/');
});


router.get('/logout', function(req, res){
  req.logout();
  req.session.destroy();
  res.redirect('/');
});



module.exports = router;
