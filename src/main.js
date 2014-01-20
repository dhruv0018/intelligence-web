var pkg = require('../package.json');

var component = require('../build/build.js');

require('angular');
require('bootstrap');

require('./app');

require('./models/kvs');
require('./models/users');
require('./models/sports');
require('./models/teams');
require('./models/schools');
require('./models/leagues');
require('./models/games');
require('./models/players');
require('./models/tagsets');

require('./services/authentication');
require('./services/authorization');
require('./services/tokens');
require('./services/session');
require('./services/account');
require('./services/alerts');
require('./services/users');
require('./services/teams');
require('./services/schools');
require('./services/leagues');
require('./services/sports');
require('./services/games');
require('./services/players');
require('./services/tagsets');

require('./directives/alert');
require('./directives/match');
require('./directives/form');
require('./directives/button');
require('./directives/input');
require('./directives/submit');

require('./directives/verify-password.js');

require('./config');
require('./flow');
require('./routes');
require('./errors');

component('root');
component('login');
component('role');
component('roles');
component('header');
component('alertbar');
component('account');
component('users');
component('teams');
component('schools');
component('leagues');

component('coach');

angular.bootstrap(document, [pkg.name]);
