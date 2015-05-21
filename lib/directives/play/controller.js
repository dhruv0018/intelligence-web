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
    'EventManager',
    'PlaylistEventEmitter',
    'SessionService',
    'IndexingService',
    'VideoPlayer',
    'ROLES',
    'EVENT',
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
        eventManager,
        playlistEventEmitter,
        session,
        indexing,
        videoPlayer,
        ROLES,
        EVENT,
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
        playlistEventEmitter.on(CUSTOM_TAGS_EVENTS.SAVE, event => {
            play = plays.get(play.id);
            $scope.customTags = customtags.getList(play.customTagIds);
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
    }
]);
