const angular = window.angular;

const SelfEditedPlayStateNotifier = angular.module('SelfEditedPlayStateNotifier', []);

/**
 *
 * Given a self-edited-play, notifies self editor related components
 * to the changes that have been made such as creation and deletion
 *
 * @module IntelligenceWebClient
 * @name SelfEditedPlayStateNotifier
 * @type {service}
 */
SelfEditedPlayStateNotifier.service('SelfEditedPlayStateNotifier', [
    '$rootScope',
    function($rootScope) {

        /* Given a self-edited-play that was just created, this will notify
        * listeners to the event ‘self-edited-play-create’
        */
        this.notifyDidCreate = function(play) {
            $rootScope.$broadcast('self-edited-play-state-notifier-did-create', play);
        };


        /* Given a self-edited-play that was just deleted, this will notify
         * listeners to the event ‘self-edited-play-delete’
         */
        this.notifyDidDelete = function(play) {
            $rootScope.$broadcast('self-edited-play-state-notifier-did-delete', play);
        };

        /* Given a self-edited-play that was just created finished, this will notify
         * listeners to the event ‘self-edited-play-state-notifier-did-create-finish’
         */
        this.notifyDidCreateFinish = function(play) {
            $rootScope.$broadcast('self-edited-play-state-notifier-did-create-finish', play);
        };

        /* Given a self-edited-play that was just created finished, this will notify
         * listeners to the event ‘self-edited-play-state-notifier-did-create-finish’
         */
        this.notifyDidCreateFinishClear = function(play) {
            $rootScope.$broadcast('self-edited-play-state-notifier-did-create-finish-clear', play);
        };
        
    }
]);

export default SelfEditedPlayStateNotifier;
