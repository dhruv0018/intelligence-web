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
    'PlayManager',
    'PlaylistEventEmitter',
    'PLAYLIST_EVENTS',
    function controller(
        $scope,
        playManager,
        playlistEventEmitter,
        PLAYLIST_EVENTS
        ) {

        $scope.playManager = playManager;

        $scope.selectedPlays = [];

        playlistEventEmitter.on(PLAYLIST_EVENTS.SELECT_PLAY_EVENT, event => {
            getSelectedPlays();
        });

        $scope.confirmTagSave = false;
        $scope.$on('confirmTagSave', (event, value) => $scope.confirmTagSave = value);

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
