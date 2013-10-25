var pkg = require('../package.json');

var component = require('../build/build.js');

require('angular');
require('angularui');
require('bootstrap');

require('./app');

require('./models/users');
require('./models/schools');

require('./services/authentication');
require('./services/token');
require('./services/session');
require('./services/users');
require('./services/schools');

require('./routes');
require('./errors');

component('login');
component('role');
component('roles');
component('header');
component('account');
component('users');
component('schools');

angular.bootstrap(document, [pkg.name]);
