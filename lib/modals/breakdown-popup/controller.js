/**
 * Arena Modal controller class
 * @class BreakdownModal
 */

BreakdownModalContoller.$inject = [
    '$scope',
    'playIds',
    '$modalInstance',
    'PlayManager',
    'PlaysManager',
    'GamesFactory',
    'PlaysFactory'
];

function BreakdownModalContoller (
    scope,
    playIds,
    $modalInstance,
    playManager,
    playsManager,
    gamesFactory,
    playsFactory
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
        $modalInstance.close();
    };
}

export default BreakdownModalContoller;
