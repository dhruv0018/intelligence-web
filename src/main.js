var pkg = require('../package.json');

require('angular');
require('angularui');
require('bootstrap');

var component = require('../build/build.js');

require('./app');

angular.bootstrap(document, [pkg.name]);

