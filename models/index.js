var fs        = require('fs');
var path      = require('path');
var _         = require('lodash');
var Sequelize = require('sequelize');
var lodash    = require('lodash');
var app       = require('../app.js');
var dbconfig  = app.get('dbconfig');
var sequelize = new Sequelize(dbconfig.database, dbconfig.username, dbconfig.password, {
  host: dbconfig.host
});
var db = {};

fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
  })
  .forEach(function (file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

// Apply the associations
_.forEach(Object.keys(db), function(modelName) {
  if ('associate' in db[modelName]) db[modelName].associate(db);
});

module.exports = lodash.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db);

sequelize.sync({force: true});