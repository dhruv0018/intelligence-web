/**
 * Arena Modal controller class
 * @class BreakdownModal
 */

BreakdownModalContoller.$inject = [
    '$scope',
    'playIds',
    '$uibModalInstance',
    'PlayManager',
    'PlaysManager',
    'GamesFactory',
    'PlaysFactory',
    '$rootScope'
];

function BreakdownModalContoller (
    scope,
    playIds,
    $uibModalInstance,
    playManager,
    playsManager,
    gamesFactory,
    playsFactory,
    $rootScope
) {

    const plays = playIds.map(playId => playsFactory.get(playId));

    // FIXME: game could be different if plays are from different games.
    const play = plays[0];
    const gameId = play.gameId;
    const game = gamesFactory.get(gameId);

    playsManager.reset(plays);
    playsManager.calculatePlays();
    playManager.current = play;

    scope.video = play.clip;
    scope.plays = plays;
    scope.game = game;
    scope.expandAll = false;
    scope.showHeader = true;
    scope.showFooter = false;
    scope.filteredPlaysIds = [];

    scope.closeModal = () => {
        $uibModalInstance.close();
        $rootScope.$broadcast('close-play-breakdown');
    };
}

export default BreakdownModalContoller;
