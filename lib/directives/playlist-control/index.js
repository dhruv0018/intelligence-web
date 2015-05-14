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
    '$modal',
    'GamesFactory',
    'PlayManager',
    'PlaylistEventEmitter',
    'SessionService',
    'PLAYLIST_EVENTS',
    'ROLES',
    function controller(
        $scope,
        $modal,
        games,
        playManager,
        playlistEventEmitter,
        session,
        PLAYLIST_EVENTS,
        ROLES
    ) {

        $scope.playManager = playManager;
        $scope.currentUser = session.getCurrentUser();
        $scope.ROLES = ROLES;
        $scope.selectedPlays = [];
        $scope.options = {scope: $scope};

        if ($scope.plays) {
            $scope.gameId = $scope.plays[0].gameId;
            $scope.game = games.get($scope.gameId);
            $scope.isTeamMember = session.getCurrentTeamId() === $scope.game.uploaderTeamId;
        }

        playlistEventEmitter.on(PLAYLIST_EVENTS.SELECT_PLAY_EVENT, event => {
            getSelectedPlays();
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
