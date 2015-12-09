const angular = window.angular;

import Features from './features';

//TODO: import these directly from directives, dialogs, or modal module
import AppDownloads from './directives/app-downloads';
import AdminQueueGames from './directives/admin-queue-games';
import AdminQueuePagination from '../lib/directives/admin-queue-pagination';
import FieldComponent from './directives/field';
import IndexingBlock from './directives/indexing-block';
import DynamicTables from './directives/dynamic-tables';
import { IndexerFields, UserFields } from './directives/fields';
import Play from './directives/play';
import SelectMediaSrc from './directives/video-player/select-media-src';
import ArenaChart from './directives/arena-chart';
import AdminRole from './directives/admin-role';
import EventAdjuster from './directives/event-adjuster';
import HighlightOnClick from './directives/highlight-on-click';
import KrossoverPrioritySelect from './directives/priority-select';
import KrossoverLabelSelect from './directives/label-select';
import KrossoverTeamLabelIcon from './directives/team-label-icon';
import PriorityLabelLegend from './directives/priority-label-legend';
import KrossoverPriorityLabelIcon from './directives/priority-label-icon';

import BreakdownDialog from './dialogs/breakdown-dialog';

import RevertGameStatus from './modals/revert-game-status';

/**
 * Lib module.
 * @module Lib
 */
const Lib = angular.module('Lib', [
    'Features',
    'Modals',
    'Filters',
    'Directives',
    'Dialogs',
]);

export default Lib;
