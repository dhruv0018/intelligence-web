const angular = window.angular;

import AddProfileTeam from './add-profile-team';
import AdminManagement from './admin-management';
import BasicEditProfile from './basic-edit-profile';
import BasicModals from './basic-modals';
import BreakdownPurchase from './breakdown-purchase';
import CancelChangeEmail from './cancel-change-email';
import ChangeEmail from './change-email';
import ChangePassword from './change-password';
import CopyGame from './game-copy';
import DeleteGame from './delete-game';
import ExcelUpload from './excel-upload';
import FilmExchangeTeams from './film-exchange-teams';
import Info from './info';
import kvsUploaderInterface from './kvs-uploader-interface';
import ManageProfileReels from './manage-profile-reels';
import ProfileOnboarding from './profile-onboarding';
import QaPickup from './qa-pickup';
import RawFilm from './raw-film';
import RevertGameStatus from './revert-game-status';
import RunDistribution from './run-distribution';
import SelectIndexer from './select-indexer';
import ShareFilm from './share-film';

/**
 * Modals module.
 * @module Modals
 */
const Modals = angular.module('Modals', [
    'AddProfileTeam',
    'AdminManagement',
    'BasicEditProfile',
    'BasicModals',
    'BreakdownPurchase',
    'CancelChangeEmail',
    'ChangeEmail',
    'ChangePassword',
    'CopyGame',
    'CopyRawFilm',
    'DeleteGame',
    'ExcelUpload',
    'FilmExchangeTeams',
    'Info',
    'KvsUploaderInterface',
    'ManageProfileReels',
    'ProfileOnboarding',
    'QaPickup',
    'RawFilm',
    'RevertGameStatus',
    'RunDistribution',
    'SelectIndexer',
    'ShareFilm'
]);

export default Modals;
