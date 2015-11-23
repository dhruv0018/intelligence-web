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
                plays: '=?',
                isReel: '=?'
            },

            replace: true,

            controller: 'PlaylistControl.controller',

            templateUrl: templateUrl

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
    '$modal',
    'GamesFactory',
    'PlayManager',
    'PlaylistEventEmitter',
    'SessionService',
    'PLAYLIST_EVENTS',
    'CUSTOM_TAGS_EVENTS',
    'ROLES',
    'ROLE_TYPE',
    function controller(
        $scope,
        $timeout,
        $modal,
        games,
        playManager,
        playlistEventEmitter,
        session,
        PLAYLIST_EVENTS,
        CUSTOM_TAGS_EVENTS,
        ROLES,
        ROLE_TYPE
    ) {

        $scope.playManager = playManager;
        $scope.currentUser = session.getCurrentUser();
        $scope.ROLES = ROLES;
        $scope.selectedPlays = [];
        $scope.options = {scope: $scope};
        $scope.confirmTagSave = false;
        $scope.isReel = $scope.isReel || false;

        if ($scope.plays) {
            $scope.gameId = $scope.plays[0].gameId;
            $scope.game = games.get($scope.gameId);
            $scope.filteredPlays = $scope.plays;

            if ($scope.currentUser.is(ROLES.COACH)) {
                $scope.isTeamMember = $scope.game.isTeamUploadersTeam(session.getCurrentTeamId());
            } else if ($scope.currentUser.is(ROLES.ATHLETE)) {
                let athleteRoles = $scope.currentUser.getRoles(ROLE_TYPE.ATHLETE);
                $scope.isTeamMember = athleteRoles.some(role => $scope.game.isTeamUploadersTeam(role.teamId));
            } else {
                $scope.isTeamMember = false;
            }
        }

        playlistEventEmitter.on(PLAYLIST_EVENTS.SELECT_PLAY_EVENT, event => {
            getSelectedPlays();
        });

        playlistEventEmitter.on(CUSTOM_TAGS_EVENTS.SAVE, customTagsEvent => {
            if (customTagsEvent.showConfirmation) {
                $scope.updatedTagCount = customTagsEvent.updatedTagCount;
                $scope.confirmTagSave = true;

                // Show confirmation that tags were saved for 2 seconds
                $timeout( () => {
                    $scope.confirmTagSave = false;
                }, 2000);
            }
        });

        function getSelectedPlays() {
            $scope.selectedPlays = $scope.plays.filter( play => {
                return play.isSelected;
            });
        }

        $scope.toggleSelectAllPlays = function toggleSelectAllPlays() {

            $scope.filteredPlays = $scope.plays.filter( play => {
                return play.isFiltered;
            });

            if ($scope.selectedPlays.length === $scope.filteredPlays.length) {
                $scope.plays.map(function deselectAllPlays(play) {
                    play.isSelected = false;
                });
            } else {
                $scope.filteredPlays.map(function selectAllPlays(play) {
                    play.isSelected = true;
                });
            }

            // Update selected plays
            getSelectedPlays();
        };

        $scope.$on('$destroy', onDestroy);

        function onDestroy() {
            $scope.plays.forEach( play => {
                delete play.isSelected;
            });
        }
    }
]);
