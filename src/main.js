var pkg = require('../package.json');

require('./appcache');

require('traceur/bin/traceur-runtime');

/* Vendor dependencies */
require('./vendor');

/* Fetch angular from the browser scope */
var angular = window.angular;

/* Extend Angular core */
require('./extensions');

/* Components */
require('../build/build');

import Reel from '../app/reel/index.js';
import Embed from '../app/embed/index.js';
import Indexer from '../app/indexer/index.js';
import Styleguide from '../app/styleguide/index.js';
import Analytics from '../app/analytics/index.js';

import AppDownloads from '../lib/directives/app-downloads';
import FieldComponent from '../lib/directives/field';
import IndexingBlock from '../lib/directives/indexing-block';
import DynamicTables from '../lib/directives/dynamic-tables';
import { IndexerFields, UserFields } from '../lib/directives/fields';
import Play from '../lib/directives/play';
import SelectMediaSrc from '../lib/directives/video-player/select-media-src';
import ArenaChart from '../lib/directives/arena-chart';
import BreakdownDialog from '../lib/dialogs/breakdown-dialog';
import AdminRole from '../lib/directives/admin-role';
import EventAdjuster from '../lib/directives/event-adjuster';
import KrossoverPrioritySelect from '../lib/directives/priority-select';
import KrossoverLabelSelect from '../lib/directives/label-select';
import KrossoverTeamLabelIcon from '../lib/directives/team-label-icon';
import RevertGameStatus from '../lib/modals/revert-game-status';

/* App dependencies */
require('./config');

require('./app');

require('./features');

require('./compile');
require('./utilities');
require('./indexeddb');
require('./flow');
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

require('./constants/users');
require('./constants/games');
require('./constants/event');
require('./constants/events');
require('./constants/schools');
require('./constants/videos');
require('./constants/tagsets');
require('./constants/filtersets');
require('./constants/kvs-whitelist');
require('./constants/turnaroundtimes');
require('./constants/football/gaps');
require('./constants/football/zones');
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
import { PRIORITIES_IDS, PRIORITIES } from './constants/priorities';
import { LABELS_IDS, LABELS } from './constants/labels';


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
require('./models/reels');
require('./models/plans');
require('./models/customtags');

require('./storage/base');
require('./storage/users');
require('./storage/teams');
require('./storage/games');
require('./storage/schools');
require('./storage/sports');
require('./storage/leagues');
require('./storage/plays');
require('./storage/players');
require('./storage/tagsets');
require('./storage/filtersets');
require('./storage/reels');
require('./storage/positionsets');
require('./storage/plans');
require('./storage/customtags');

require('./factories');
require('./factories/base');
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
require('./factories/reels');
require('./factories/positionsets');
require('./factories/plans');
require('./factories/customtags');

require('./emitters/emitter.js');
require('./emitters/playlist');
require('./emitters/video-player');
require('./emitters/telestrations');
require('./emitters/cue-point-event-emitter');
require('./emitters/ui-event');

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

require('./aggregates');

require('./values');

require('./entities');

import CustomTagsEvent from './events/customtags';

require('./bootstrap');

import * as Brokers from './brokers';
import * as Entities from './entities';
