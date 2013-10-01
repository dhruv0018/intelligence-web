var pkg = require('../package.json');

var component = require('../build/build.js');

require('angular');
require('angularui');
require('bootstrap');

require('./app');

require('./services/token');
require('./services/authentication');

require('./models/users');

require('./routes');

component('login');
component('account');

angular.bootstrap(document, [pkg.name]);
