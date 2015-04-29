var fs        = require('fs');
var path      = require('path');
var _         = require('lodash');

fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
  })
  .forEach(function (file) {
    exports[file.replace('.js', '')] = require('./' + file);
  });