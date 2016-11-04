var pkg = require('../package.json');

require('./appcache');

require('traceur/bin/traceur-runtime');

/* Vendor dependencies */
require('./vendor');

/* Fetch angular from the browser scope */
var angular = window.angular;

/* Extend Angular core */
require('./extensions');

/* App dependencies */
require('./config');

require('./app');

require('./features');

require('./compile');
require('./utilities');
require('./indexeddb');
require('./users');
require('./routes');
require('./errors');
require('./viewports');
require('./device');
require('./mediator');
require('./feature-flag');

require('./http/interceptors/503');
require('./http/interceptors/error');
require('./http/interceptors/auth');
require('./http/interceptors/broadcast');
require('./http/transforms/date');

require('./http/interceptors/queue');
require('./services');
require('./services/authentication');
require('./services/authorization');
require('./services/tokens');
require('./services/session');
require('./services/account');
require('./services/queue');
require('./services/alerts');
require('./services/indexing');
require('./services/date');
require('./services/detectDevice');
require('./services/analytics');
import './services/performance-timer/angular-index';
import './services/performance-timer';
require('./services/fileUpload/fileUploadService');
require('./services/fileUpload/fileUploadEvaporate');
require('./services/games-resolution/index');
require('./services/admin-games');
require('./services/indexer-games');
require('./services/plan');
require('./services/game-states');
require('./services/search-admin');

require('./constants/users');
require('./constants/games');
require('./constants/event');
require('./constants/events');
require('./constants/schools');
require('./constants/stat-types');
require('./constants/videos');
require('./constants/tagsets');
require('./constants/filtersets');
require('./constants/kvs-whitelist');
require('./constants/turnaroundtimes');
require('./constants/football/gaps');
require('./constants/football/zones');
require('./constants/football/formations');
require('./constants/sports');
require('./constants/viewports');
require('./constants/breakpoints');
require('./constants/arenas');
require('./constants/device');
require('./constants/states');
require('./constants/video-player');
require('./constants/views');
require('./constants/mobile-apps');
require('./constants/schemas');
require('./constants/subscriptions');
require('./constants/playlist');
require('./constants/keyboard');
require('./constants/telestrations');
require('./constants/feature-flags');
require('./constants/cue-points');
require('./constants/transcodeProfiles');
require('./constants/associations');
require('./constants/teams');
require('./constants/indexer-groups');
import { PRIORITIES_IDS, PRIORITIES } from './constants/priorities';
import { LABELS_IDS, LABELS } from './constants/labels';
import EMAILS from './constants/emails';
import ARENA_CHART from './constants/arena-chart';
require('./constants/film-exchange');

require('./models/users');
require('./models/sports');
require('./models/teams');
require('./models/schools');
require('./models/leagues');
require('./models/games');
require('./models/players');
require('./models/tagsets');
require('./models/positionsets');
require('./models/plays/plays');
require('./models/plays/selfeditedplays');
require('./models/filtersets');
require('./models/reels');
require('./models/plans');
require('./models/customtags');
require('./models/formationlabels');
require('./models/associations');
require('./models/conferences');
require('./models/iso3166countries');
require('./models/filmexchange');
require('./models/indexer');

require('./storage/base');
require('./storage/users');
require('./storage/teams');
require('./storage/games');
require('./storage/schools');
require('./storage/sports');
require('./storage/leagues');
require('./storage/plays/plays');
require('./storage/plays/selfeditedplays');
require('./storage/players');
require('./storage/tagsets');
require('./storage/filtersets');
require('./storage/reels');
require('./storage/positionsets');
require('./storage/plans');
require('./storage/customtags');
require('./storage/formationlabels');
require('./storage/associations');
require('./storage/conferences');
require('./storage/iso3166countries');
require('./storage/filmexchange');
require('./storage/indexer');

require('./factories');
require('./factories/base');
require('./factories/users');
require('./factories/teams');
require('./factories/games');
require('./factories/schools');
require('./factories/sports');
require('./factories/leagues');
require('./factories/plays/plays');
require('./factories/plays/selfeditedplays');
require('./factories/players');
require('./factories/tagsets');
require('./factories/filtersets');
require('./factories/reels');
require('./factories/positionsets');
require('./factories/plans');
require('./factories/customtags');
require('./factories/formationlabels');
require('./factories/associations');
require('./factories/conferences');
require('./factories/iso3166countries');
require('./factories/filmexchange');
require('./factories/indexer');

require('./emitters/emitter.js');
require('./emitters/playlist');
require('./emitters/video-player');
require('./emitters/telestrations');
require('./emitters/cue-point-event-emitter');
require('./emitters/ui-event');
require('./emitters/admin-games');

require('./brokers/telestrationsVideoPlayerBroker');

require('./managers/tags');
require('./managers/play');
require('./managers/plays');
require('./managers/event');
require('./managers/storage');
require('./managers/playerlist');
require('./managers/playlist');
require('./mediators/event');

require('./directives/alert');
require('./directives/match');
require('./directives/form');
require('./directives/anchor');
require('./directives/button');
require('./directives/input');
require('./directives/submit');
require('./directives/keyboard');
require('./directives/focus');
require('./directives/autofocus');
require('./directives/autotab');

require('./v3/factories/v3teams');
require('./v3/factories/v3schools');
require('./v3/factories/v3leagues');

require('./v3/models/v3teams');

require('./aggregates');

require('./values');

require('./entities');

require('./v3/models/v3Resource');
require('./v3/models/v3Example');
require('./v3/factories/v3Base');
require('./v3/factories/v3Example');
require('./v3/factories/v3Conferences');
require('./v3/factories/v3DataParser');
require('./v3/factories/v3IndexerGroups');
require('./v3/factories/v3IndexerGroupAllocationPermissions');

import CustomTagsEvent from './events/customtags';

require('./bootstrap');

import * as Brokers from './brokers';
import * as Entities from './entities';
