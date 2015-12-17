const angular = window.angular;

const SelfEditedPlayControlsModeNotifier = angular.module('SelfEditedPlayControlsModeNotifier', []);

/**
 *
 * This service is used to communicate whether or not a play is being edited
 * between the self-edited-play-controls directive and the self-edited-play directive
 *
 * @module IntelligenceWebClient
 * @name SelfEditedPlayControlsModeNotifier
 * @type {service}
 */
SelfEditedPlayControlsModeNotifier.service('SelfEditedPlayControlsModeNotifier', [
    '$rootScope',
    function($rootScope) {

        /*
         * Given a self-edited-play, this will notify listeners to the event
         * ‘self-edited-play-controls-enable-edit-mode’
         */
        this.notifyEnableEditMode = function(play) {
            $rootScope.$broadcast('self-edited-play-controls-enable-edit-mode', play);
        };

        /*
         * Given a self-edited-play, this will notify listeners to the event
         * ‘self-edited-play-controls-disable-edit-mode’
         */
        this.notifyDisableEditMode = function(play) {
            $rootScope.$broadcast('self-edited-play-controls-disable-edit-mode', play);
        };

        /* Notify listeners to the event 'self-edited-play-start-notifier-reset-to-default-mode' */
        this.notifyResetToDefaultMode = function() {
            $rootScope.$broadcast('self-edited-play-start-notifier-reset-to-default-mode');
        };

        /* Notify listeners to the event 'self-edited-play-start-notifier-reset-to-editor-mode' */
        this.notifyResetToEditorMode = function() {
            $rootScope.$broadcast('self-edited-play-start-notifier-reset-to-editor-mode');
        };
    }
]);

export default SelfEditedPlayControlsModeNotifier;
