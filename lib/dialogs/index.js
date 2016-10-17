/* Fetch angular from the browser scope */
const angular = window.angular;

import ArenaDialog from './arena-dialog';
import BreakdownDialog from './breakdown-dialog';
import MobileAppDialog from './mobile-app-dialog';
import TermsDialog from './terms-dialog';
import SendToQaDialog from './send-to-qa';

/**
 * Dialogs module.
 * @module Dialogs
 */
const Dialogs = angular.module('Dialogs', [
    'BreakdownDialog',
    'TermsDialog',
    'MobileAppDialog',
    'ArenaDialog',
    'SendToQaDialog'
]);

export default Dialogs;
