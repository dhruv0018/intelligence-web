/* Fetch angular from the browser scope */
const angular = window.angular;

EmbedController.$inject = [
    '$rootScope',
    '$scope',
    '$state',
    '$stateParams',
    'ReelsFactory',
    'GamesFactory',
    'PlaysFactory',
    'PlayManager',
    'PlaysManager'
];

/**
 * Embed controller.
 * @module Embed
 * @name EmbedController
 * @type {Controller}
 */
function EmbedController(
    $rootScope,
    $scope,
    $state,
    $stateParams,
    reelsFactory,
    gamesFactory,
    playsFactory,
    playManager,
    playsManager
) {

    let reelId = Number($stateParams.id);
    let reel = reelsFactory.get(reelId);
    let plays = reel.plays.map(mapPlays);
    let play = plays[0];
    let game = gamesFactory.get(plays[0].gameId);
    $scope.reel = reel;
    $scope.plays = plays;
    $scope.playManager = playManager;
    $scope.video = plays[0].clip;
    $scope.currentPlayId = play.id;

    playManager.current = play;

    /* TODO: game.getPosterImage() */
    $scope.posterImage = {
        url: game.video.thumbnail
    };

    function mapPlays (playId, index) {

        let play = playsFactory.get(playId);

        return play;
    }
}

export default EmbedController;
