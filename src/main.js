var package = require('../package.json');

/* Vendor dependencies */
require('./vendor');

/* Fetch angular from the browser scope */
var angular = window.angular;

/* Components */
require('../build/build');

/* App dependencies */
require('./config');

require('./app');

require('./flow');
require('./routes');
require('./errors');

require('./services/authentication');
require('./services/authorization');
require('./services/tokens');
require('./services/session');
require('./services/account');
require('./services/alerts');
require('./services/scripts');
require('./services/indexing');

require('./constants/users');
require('./constants/games');
require('./constants/schools');
require('./constants/videos');
require('./constants/tagsets');
require('./constants/filtersets');
require('./constants/kvs-whitelist');
require('./constants/turnaroundtimes');
require('./constants/football/gaps');
require('./constants/football/zones');

require('./models/users');
require('./models/sports');
require('./models/teams');
require('./models/schools');
require('./models/leagues');
require('./models/games');
require('./models/players');
require('./models/tagsets');
require('./models/positionsets');
require('./models/plays');
require('./models/filtersets');
require('./models/plans');

require('./factories/users');
require('./factories/teams');
require('./factories/games');
require('./factories/schools');
require('./factories/sports');
require('./factories/leagues');
require('./factories/plays');
require('./factories/players');
require('./factories/tagsets');
require('./factories/filtersets');
require('./factories/positionsets');
require('./factories/plans');
require('./factories/date');

require('./managers/tags');
require('./managers/play');
require('./managers/event');

require('./directives/alert');
require('./directives/match');
require('./directives/form');
require('./directives/button');
require('./directives/input');
require('./directives/submit');
require('./directives/keyboard');
require('./directives/draggable');
require('./directives/focus');
require('./directives/autofocus');
require('./directives/autotab');
require('./directives/verify-password.js');
require('./directives/krossover/videoplayer');

angular.bootstrap(document, [package.name]);

