/* Constants */
let TO = '';
const ELEMENTS = 'E';

const templateUrl = 'playlist-control.html';

/* Component resources */
const template = require('./template.html');

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * PlaylistControl
 * @module PlaylistControl
 */
const PlaylistControl = angular.module('PlaylistControl', [
    'ui.bootstrap'
]);

/* Cache the template file */
PlaylistControl.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * PlaylistControl directive.
 * @module PlaylistControl
 * @name PlaylistControl
 * @type {directive}
 */
PlaylistControl.directive('krossoverPlaylistControl', [
    function directive() {

        const PlaylistControl = {

            restrict: TO += ELEMENTS,

            scope: {
                plays: '=?'
            },

            replace: true,

            controller: 'PlaylistControl.controller',

            templateUrl: templateUrl,

        };

        return PlaylistControl;
    }
]);

/**
* PlaylistControl controller
*/
PlaylistControl.controller('PlaylistControl.controller', [
    '$scope',
    '$timeout',
    'PlayManager',
    'PlaylistEventEmitter',
    'PLAYLIST_EVENTS',
    'CUSTOM_TAGS_EVENTS',
    function controller(
        $scope,
        $timeout,
        playManager,
        playlistEventEmitter,
        PLAYLIST_EVENTS,
        CUSTOM_TAGS_EVENTS
        ) {

        $scope.playManager = playManager;

        $scope.selectedPlays = [];

        playlistEventEmitter.on(PLAYLIST_EVENTS.SELECT_PLAY_EVENT, event => {
            getSelectedPlays();
        });

        $scope.confirmTagSave = false;
        $scope.$on(CUSTOM_TAGS_EVENTS.SAVE, event => {
            $scope.confirmTagSave = true;

            // Show confirmation that tags were save for 2 seconds
            $timeout( () => {
                $scope.confirmTagSave = false;
            }, 2000);
        });

        function getSelectedPlays() {
            $scope.selectedPlays = $scope.plays.filter( play => {
                return play.isSelected;
            });
        }

        $scope.toggleSelectAllPlays = function toggleSelectAllPlays() {

            if ($scope.selectedPlays.length === $scope.plays.length) {
                $scope.plays.map(function deselectAllPlays(play) {
                    play.isSelected = false;
                });
            } else {
                $scope.plays.map(function selectAllPlays(play) {
                    play.isSelected = true;
                });
            }

            // Update selected plays
            getSelectedPlays();
        };
    }
]);
