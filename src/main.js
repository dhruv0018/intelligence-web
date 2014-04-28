var pkg = require('../package.json');

var component = require('../build/build.js');

require('angular/angular');
require('angular-sanitize/angular-sanitize');
require('angular-resource/angular-resource');
require('angular-bootstrap/ui-bootstrap-tpls');
require('angular-ui-utils/ui-utils');
require('angular-ui-router/release/angular-ui-router');
require('ngStorage/ngStorage');
require('flowjs');
require('flow/src/angular-flow');
require('flow/src/provider');
require('flow/src/directives/btn');
require('flow/src/directives/drop');
require('flow/src/directives/drag-events');
require('flow/src/directives/init');
require('flow/src/directives/events');
require('flow/src/directives/transfers');
require('flow/src/directives/img');
require('videogular/videogular');
require('videogular-controls/controls');
require('videogular-buffering/buffering');
require('videogular-overlay-play/overlay-play');
require('videogular-poster/poster');

require('./app');

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

require('./config');
require('./flow');
require('./routes');
require('./errors');

component('root');
component('login');
component('role');
component('roles');
component('rolebar');
component('header');
component('alertbar');
component('plan');
component('account');
component('users');
component('teams');
component('schools');
component('queue');
component('leagues');
component('no-results');

component('admin');
component('coach');
component('indexer');
component('indexing');

component('item');
component('event');
component('events');
component('play');
component('plays');

component('videoplayer');

component('roster');
component('athlete');
component('team-info');
component('coach-info');
component('thumbnail');
component('film');
component('mascot-placeholder');
component('profile-placeholder');
component('sport-placeholder');
component('role-icon');
component('add-player');

angular.bootstrap(document, [pkg.name]);

