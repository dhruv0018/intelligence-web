/* Fetch angular from the browser scope */
var angular = window.angular;

IndexingMainController.$inject = [
    'config',
    '$rootScope',
    '$scope',
    '$uibModal',
    'BasicModals',
    '$stateParams',
    'SessionService',
    'IndexingService',
    'TagsManager',
    'PlaylistManager',
    'PlaysManager',
    'PlayManager',
    'EventManager',
    'Indexing.Sidebar',
    'Indexing.Data',
    'LeaguesFactory',
    'TagsetsFactory',
    'TeamsFactory',
    'GamesFactory',
    'PlaysFactory',
    'VideoPlayer'
];

/**
 * Indexing controller.
 * @module Indexing
 * @name IndexingMainController
 * @type {Controller}
 */
function IndexingMainController(config,
                    $rootScope,
                    $scope,
                    $uibModal,
                    basicModal,
                    $stateParams,
                    session,
                    indexing,
                    tags,
                    playlistManager,
                    playsManager,
                    play,
                    event,
                    sidebar,
                    data,
                    leagues,
                    tagsets,
                    teams,
                    games,
                    plays,
                    videoPlayer
                    ) {

    var gameId = Number($stateParams.id);

    $scope.tags = tags;
    $scope.play = play;
    $scope.plays = playsManager.plays;
    $scope.event = event;
    $scope.sidebar = sidebar;
    $scope.indexing = indexing;
    $scope.game = games.get(gameId);
    $scope.team = teams.get($scope.game.teamId);
    $scope.opposingTeam = teams.get($scope.game.opposingTeamId);
    $scope.teamPlayers = data.teamPlayers;
    $scope.opposingTeamPlayers = data.opposingTeamPlayers;
    $scope.league = leagues.get($scope.team.leagueId);
    $scope.tagset = tagsets.get($scope.league.tagSetId);
    $scope.videoPlayer = videoPlayer;

    //Watch for fullscreen change
    $scope.$watch(videoPlayerFullScreenWatch.bind(this));

    var playsList = plays.getList({ gameId: gameId });

    indexing.reset($scope.tagset, $scope.game, playsList);

    playlistManager.isEditable = true;

    /**
     * Watch for video player full screen changes.
     */
    function videoPlayerFullScreenWatch () {
        $scope.fullScreenEnabled = videoPlayer.isFullScreen;
    }

}

export default IndexingMainController;
