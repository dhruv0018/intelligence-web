/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Play
 * @module Play
 */
const Play = angular.module('Play');

/**
 * Play controller.
 * @module Play
 * @name Play.controller
 * @type {controller}
 */
Play.controller('Play.controller', PlayController);

PlayController.$inject = [
    '$scope',
    '$state',
    'config',
    'PlaysFactory',
    'LeaguesFactory',
    'TeamsFactory',
    'GamesFactory',
    'CustomtagsFactory',
    'PlayManager',
    'PlaysManager',
    'PlaylistEventEmitter',
    'SessionService',
    'VideoPlayer',
    'ROLES',
    'ROLE_TYPE',
    'EVENT',
    'PLAYLIST_EVENTS',
    'VG_STATES',
    'VIEWPORTS',
    'CUSTOM_TAGS_EVENTS'
];

function PlayController (
    $scope,
    $state,
    config,
    plays,
    leagues,
    teams,
    games,
    customtags,
    playManager,
    playsManager,
    playlistEventEmitter,
    session,
    videoPlayer,
    ROLES,
    ROLE_TYPE,
    EVENT,
    PLAYLIST_EVENTS,
    VG_STATES,
    VIEWPORTS,
    CUSTOM_TAGS_EVENTS
) {

    let play = $scope.play;
    let gameId = $scope.play.gameId;
    let homeTeamId = games.get(gameId).teamId;
    let opposingTeamId = games.get(gameId).opposingTeamId;

    // Get custom tags for this play
    $scope.customTags = customtags.getList(play.customTagIds);

    // Update play if custom tags are updated.
    playlistEventEmitter.on(CUSTOM_TAGS_EVENTS.SAVE, customTagsEvent => {
        if (customTagsEvent.updatedPlayIds.indexOf(play.id) !== -1) {
            play = plays.get(play.id);
            $scope.customTags = customtags.getList(play.customTagIds);
        }
    });

    playlistEventEmitter.on(EVENT.PLAYLIST.FIELD.SELECT_VALUE, onSelectFieldValue);

    $scope.$on('$destroy', onDestroy);

    $scope.team = teams.get(homeTeamId);
    $scope.opposingTeam = teams.get(opposingTeamId);

    $scope.league = leagues.get($scope.team.leagueId);
    $scope.game = games.get(play.gameId);

    $scope.options = {scope: $scope};

    $scope.teams = {};
    $scope.teams[$scope.game.teamId] = $scope.team;
    $scope.teams[$scope.game.opposingTeamId] = $scope.opposingTeam;

    $scope.play.isFiltered = true;

    let currentUser = session.currentUser;

    $scope.VIEWPORTS = VIEWPORTS;

    let isCoach = currentUser.is(ROLES.COACH);
    let isIndexer = currentUser.is(ROLES.INDEXER);
    let isAthlete = currentUser.is(ROLES.ATHLETE);
    $scope.isIndexer = isIndexer;
    $scope.isAthlete = isAthlete;

    if (isCoach) {
        $scope.isTeamMember = $scope.game.isTeamUploadersTeam(session.getCurrentTeamId());
    } else if (isAthlete) {
        let athleteRoles = currentUser.getRoles(ROLE_TYPE.ATHLETE);
        $scope.isTeamMember = athleteRoles.some(role => $scope.game.isTeamUploadersTeam(role.teamId));
    } else {
        $scope.isTeamMember = false;
    }

    $scope.playIsInBreakdown = $state.current.name === 'Games.Breakdown';

    $scope.playManager = playManager;

    $scope.videoPlayer = videoPlayer;
    $scope.VG_STATES = VG_STATES;

    $scope.playPlayed = false;

    $scope.reelsActive = config.reels.turnedOn;

    if (angular.isDefined($scope.filteredPlaysIds)) {
        $scope.$watchCollection('filteredPlaysIds', function(newFilteredPlaysIds, oldFilteredPlaysIds) {
            // Filter the play if it's in the updated filteredPlaysIds
            if (newFilteredPlaysIds !== oldFilteredPlaysIds) {

                // If filter changes, deselect play
                $scope.play.isSelected = false;
                playlistEventEmitter.emit(PLAYLIST_EVENTS.SELECT_PLAY_EVENT);

                if (newFilteredPlaysIds.indexOf($scope.play.id) !== -1) {
                    $scope.play.isFiltered = true;
                } else {
                    $scope.play.isFiltered = false;
                }
            }
        });
    }

    //hidden by default
    $scope.showPlayBody = false;

    /**
    * Selects this play.
    */
    $scope.selectPlay = function (play) {

        playlistEventEmitter.emit(EVENT.PLAYLIST.PLAY.SELECT, play);
    };

    $scope.showPlayFooter = function() {

        if ($scope.isIndexer) return true;

        if ($scope.play === playManager.current || $scope.showPlayBody || $scope.expandAll) {
            if ($scope.play.customTagIds.length && $scope.isTeamMember && !$scope.isReelsPlay) {
                return true;
            }
        } else {
            return false;
        }
    };

    function onSelectFieldValue (field) {

        /* This should only fire for playlist editability */
        if ($scope.isIndexer) return true;

        if ($scope.play.id === field.playId) {

            $scope.play.save()
                .then(() => playsManager.calculatePlays());
        }
    }

    function onDestroy () {

        playlistEventEmitter.removeListener(EVENT.PLAYLIST.FIELD.SELECT_VALUE, onSelectFieldValue);
    }
}

export default PlayController;
