/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Play
 * @module Play
 */
var Play = angular.module('Play');

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
    'LeaguesFactory',
    'TeamsFactory',
    'GamesFactory',
    'PlayManager',
    'EventManager',
    'SessionService',
    'IndexingService',
    'VideoPlayer',
    'ROLES',
    'VG_STATES',
    'VIEWPORTS',
    function controller(
        $scope,
        $state,
        $stateParams,
        $modal,
        config,
        leagues,
        teams,
        games,
        playManager,
        eventManager,
        session,
        indexing,
        videoPlayer,
        ROLES,
        VG_STATES,
        VIEWPORTS
    ) {

        var play = $scope.play;
        var gameId = $scope.play.gameId;
        var homeTeamId = games.get(gameId).teamId;
        var opposingTeamId = games.get(gameId).opposingTeamId;

        $scope.team = teams.get(homeTeamId);
        $scope.opposingTeam = teams.get(opposingTeamId);

        $scope.league = leagues.get($scope.team.leagueId);
        $scope.game = games.get(play.gameId);

        $scope.options = {scope: $scope};

        $scope.teams = {};
        $scope.teams[$scope.game.teamId] = $scope.team;
        $scope.teams[$scope.game.opposingTeamId] = $scope.opposingTeam;

        $scope.play.isFiltered = true;

        var isIndexer = session.currentUser.is(ROLES.INDEXER);

        var currentUser = session.currentUser;

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
        $scope.selectPlay = function() {

            var play = $scope.play;

            /* Set the current play to match the selected play. */
            playManager.current = play;
        };
    }
]);
