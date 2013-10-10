var pkg = require('../package.json');

var component = require('../build/build.js');

require('angular');
require('angularui');
require('bootstrap');

require('./app');

require('./services/token');
require('./services/authentication');

require('./models/users');
require('./models/schools');

require('./routes');
require('./errors');

component('login');
component('roles');
component('header');
component('account');
component('schools');

angular.bootstrap(document, [pkg.name]);
