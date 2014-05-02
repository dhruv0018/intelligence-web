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

require('./constants/kvs-whitelist');

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
require('./models/video');
require('./models/filtersets');

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
require('./services/positionsets');
require('./services/plays');
require('./services/events');
require('./services/indexing');
require('./services/filtersets');

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

