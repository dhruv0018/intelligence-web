const angular = window.angular;

import AddReelDropdown from './add-reel-dropdown';
import AddResource from './add-resource';
import AddTime from './add-time';
import AdminQueueDashboard from './admin-queue-dashboard';
import AdminQueueGames from './admin-queue-games';
import AdminQueuePagination from './admin-queue-pagination';
import AdminResourceSave from './admin-resource-save';
import AdminRole from './admin-role';
import Alertbar from './alertbar';
import AppDownloads from './app-downloads';
import Arena from './arena';
import ArenaChart from './arena-chart';
import ArenaChartFilters from './arena-chart-filters';
import ArenaEvent from './arena-event';
import AssociationCompetitionLevel from './association-competition-level';
import AssociationConference from './association-conference';
import AssociationConferenceSport from './association-conference-sport';
import AssociationFilmExchange from './association-film-exchange';
import Athlete from './athlete';
import AthleteProfileHeaderDirective from './athlete-profile-header';
import AthleteResume from './athlete-resume';
import Breakdown from './breakdown';
import BreakdownRating from './breakdown-rating';
import BreakdownText from './breakdown-text';
import Buttons from './buttons';
import CanonicalTeamTypeahead from './canonical-team-typeahead';
import CheckBox from './check-box';
import ClipsNavigation from './clips-navigation';
import CustomTagsFilter from './custom-tags-filter';
import Game from './coach-game';
import CoachInfo from './coach-info';
import ColorShape from './color-shape';
import CountLabel from './count-label';
import CustomTagPills from './custom-tag-pills';
import CustomTagsDropdown from './custom-tags-dropdown';
import CustomTagsMultiselect from './custom-tags-multiselect';
import DatePicker from './date';
import DraggableOrderedList from './draggable-ordered-list';
import DynamicTable from './dynamic-table';
import DynamicTables from './dynamic-tables';
import Event from './event';
import EventAdjuster from './event-adjuster';
import Events from './events';
import FancyToggle from './fancy-toggle';
import Feature from './feature'; //Used for feature flag
import FeedbackModal from './feedback-modal';
import Film from './film';
import filmHeader from './film-header';
import filmInfo from './film-info';
import FormToggle from './form-toggle';
import formationChart from './formation-chart';
import FieldComponent from './field';
import { IndexerFields, UserFields } from './fields';
import FormationLabel from './formation-label';
import GoToAs from './go-to-as';
import HighlightOnClick from './highlight-on-click';
import IndexerSidebar from './indexer-sidebar';
import IndexingBlock from './indexing-block';
import infiniteScroll from './infinite-scroll';
import KrossoverMultiselect from './krossover-multiselect';
import Loading from './loading';
import Managers from './managers';
import mascotPlaceholder from './mascot-placeholder';
import NoProfileReels from './no-profile-reels';
import NoResults from './no-results';
import NotesList from './notes-list';
import OpenModal from './open-modal';
import OpenModalAlert from './open-modal-alert';
import OpenModalConfirm from './open-modal-confirm';
import OpenModalText from './open-modal-text';
import Plan from './plan';
import Play from './play';
import PlaySummaries from './play-summaries';
import Playlist from './playlist';
import PlaylistControl from './playlist-control';
import Plays from './plays';
import PlaysFilter from './plays-filter';
import PlaysFilters from './plays-filters';
import positionsDropdown from './positions-dropdown';
import PriorityLabelLegend from './priority-label-legend';
import KrossoverPriorityLabelIcon from './priority-label-icon';
import Profile from './profile';
import ProfilePicture from './profile-picture';
import profilePlaceholder from './profile-placeholder';
import publicFooter from './public-footer';
import PublishUserProfileReel from './publish-user-profile-reel';
import Results from './results';
import Role from './role';
import RoleClass from './role-class';
import RoleIcon from './role-icon';
import RoleTypeahead from './role-typeahead';
import Rolebar from './rolebar';
import s3Uploader from './s3-uploader';
import SearchDropdown from './search-dropdown';
import SearchPlayerDropdown from './search-player-dropdown';
import SelectMediaSrc from './video-player/select-media-src';
import Sidebar from './sidebar';
import Spinner from './spinner';
import SportPlaceholder from './sport-placeholder';
import StateSelector from './state-selector';
import StatsExport from './stats-export';
import StatsPrint from './stats-print';
import KrossoverTeamLabelIcon from './team-label-icon';
import TeamTypeahead from './team-typeahead';
import Telestrations from './telestrations';
import TermsAndConditions from './terms-and-conditions';
import Thumbnail from './thumbnail';
import UploadStatus from './upload-status';
import Uploader from './uploader';
import UploadingControls from './uploading-controls';
import UserTypeahead from './user-typeahead';
import VerifyPassword from './verify-password';
import VideoPlayer from './video-player';
import WSCLink from './wsc-link';
import XYCoordinates from './xy-coordinates';


/**
 * Directives module.
 * @module Directives
 */
const Directives = angular.module('Directives', [
    'WSCLink',
    'HighlightOnClick',
    'AppDownloads',
    'ArenaChart',
    'CountLabel',
    'ArenaChartFilters',
    'ColorShape',
    'ArenaEvent',
    'role',
    'rolebar',
    'RoleIcon',
    'alertbar',
    'plan',
    'Event',
    'Events',
    'Play',
    'PlaySummaries',
    'Plays',
    'Playlist',
    'PlaylistControl',
    'date',
    'AddTime',
    'results',
    'no-results',
    'VideoPlayer',
    'sport-placeholder',
    'add-resource',
    'mascot-placeholder',
    'profile-placeholder',
    'NotesList',
    'positionsDropdown',
    'stateSelector',
    'uploader',
    'FeedbackModal',
    'FormationChart',
    'FormationLabel',
    'Arena',
    'xy-coordinates',
    'managers',
    'loading',
    'thumbnail',
    'OpenModal',
    'OpenModalText',
    'OpenModalConfirm',
    'OpenModalAlert',
    'DynamicTable',
    'DynamicTables',
    'team-typeahead',
    'canonical-team-typeahead',
    'user-typeahead',
    'role-typeahead',
    'VerifyPassword',
    'Breakdown',
    'breakdown-rating',
    'BreakdownText',
    'film',
    'PlaysFilters',
    'athlete',
    'uploadingControls',
    'uploadStatus',
    's3Uploader',
    'Profile',
    'film-header',
    'public-footer',
    'Coach.Game',
    'film-info',
    'PlaysFilters',
    'DraggableOrderedList',
    'Sidebar',
    'ProfilePicture',
    'AthleteProfileHeader',
    'AthleteResume',
    'NoProfileReels',
    'PublishUserProfileReel',
    'RoleClass',
    'Spinner',
    'CheckBox',
    'AdminQueueGames',
    'AdminQueuePagination',
    'TermsAndConditions',
    'FormToggle',
    'Buttons',
    'Feature',
    'IndexingBlock',
    'InfiniteScroll',
    'FancyToggle',
    'SearchDropdown',
    'SearchPlayerDropdown',
    'AdminQueueDashboard',
    'CustomTagsDropdown',
    'CustomTagsMultiselect',
    'CustomTagPills',
    'IndexerSidebar',
    'IndexerFields',
    'UserFields',
    'Field',
    'ClipsNavigation',
    'Telestrations',
    'AdminRole',
    'EventAdjuster',
    'AdminResourceSave',
    'KrossoverTeamLabelIcon',
    'KrossoverPriorityLabelIcon',
    'KrossoverMultiselect',
    'PriorityLabelLegend',
    'CustomTagsFilter',
    'PlaysFilter',
    'StatsExport',
    'AssociationCompetitionLevel',
    'AssociationConference',
    'AssociationConferenceSport',
    'AssociationFilmExchange',
    'GoToAs',
    'AddReelDropdown',
    'StatsPrint'
]);
