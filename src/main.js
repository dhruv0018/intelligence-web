var pkg = require('../package.json');

var component = require('../build/build.js');

require('angular');
require('angularui');
require('bootstrap');

require('./app');

require('./services/token');
require('./services/authentication');

require('./routes');

component('login');

angular.bootstrap(document, [pkg.name]);
