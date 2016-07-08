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
import AdminResourceSave from './directives/admin-resource-save';
import HighlightOnClick from './directives/highlight-on-click';
import KrossoverPrioritySelect from './directives/priority-select';
import KrossoverLabelSelect from './directives/label-select';
import KrossoverTeamLabelIcon from './directives/team-label-icon';
import PriorityLabelLegend from './directives/priority-label-legend';
import KrossoverPriorityLabelIcon from './directives/priority-label-icon';
import CustomTagsFilter from './directives/custom-tags-filter';
import PlaysFilter from './directives/plays-filter';
import WSCLink from './directives/wsc-link';
import FormationLabel from './directives/formation-label';
import BreakdownDialog from './dialogs/breakdown-dialog';
import RevertGameStatus from './modals/revert-game-status';
import SendToQaDialog from './dialogs/send-to-qa';
import GoToAs from './directives/go-to-as';
import AssociationCompetitionLevel from './directives/association-competition-level';
import AssociationConference from './directives/association-conference';
import AssociationConferenceSport from './directives/association-conference-sport';
import AssociationFilmExchange from './directives/association-film-exchange';
import AddReelDropdown from './directives/add-reel-dropdown';

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
    'SendToQaDialog'
]);

export default Lib;
