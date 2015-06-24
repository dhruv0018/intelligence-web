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
//TODO far too much DI -- remove some
Play.controller('Play.controller', [
    '$scope',
    '$state',
    '$stateParams',
    '$modal',
    'config',
    'PlaysFactory',
    'LeaguesFactory',
    'TeamsFactory',
    'GamesFactory',
    'CustomtagsFactory',
    'PlayManager',
    'PlaylistEventEmitter',
    'SessionService',
    'IndexingService',
    'VideoPlayer',
    'ROLES',
    'EVENT',
    'PLAYLIST_EVENTS',
    'VG_STATES',
    'VIEWPORTS',
    'CUSTOM_TAGS_EVENTS',
    function controller(
        $scope,
        $state,
        $stateParams,
        $modal,
        config,
        plays,
        leagues,
        teams,
        games,
        customtags,
        playManager,
        playlistEventEmitter,
        session,
        indexing,
        videoPlayer,
        ROLES,
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

        $scope.team = teams.get(homeTeamId);
        $scope.opposingTeam = teams.get(opposingTeamId);

        $scope.league = leagues.get($scope.team.leagueId);
        $scope.game = games.get(play.gameId);

        $scope.options = {scope: $scope};

        $scope.teams = {};
        $scope.teams[$scope.game.teamId] = $scope.team;
        $scope.teams[$scope.game.opposingTeamId] = $scope.opposingTeam;

        $scope.play.isFiltered = true;

        let isIndexer = session.currentUser.is(ROLES.INDEXER);

        let currentUser = session.currentUser;

        $scope.VIEWPORTS = VIEWPORTS;

        $scope.isIndexer = currentUser.is(ROLES.INDEXER);
        $scope.isAthlete = currentUser.is(ROLES.ATHLETE);
        $scope.isTeamMember = session.getCurrentTeamId() === $scope.game.uploaderTeamId;

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
                /* TODO: Hidden for all reels plays for now, add back in later
                 *if ($scope.isReelsPlay || $scope.play.customTagIds.length) {
                 *    if ($scope.isTeamMember) return true;
                 *}
                 */
            } else {
                return false;
            }
        };
    }
]);
