/**
 * Arena Dialog controller class
 * @class BreakdownDialog
 */

BreakdownDialogContoller.$inject = [
    '$scope',
    'playIds',
    '$mdDialog',
    'PlayManager',
    'PlaysManager',
    'GamesFactory',
    'PlaysFactory'
];

function BreakdownDialogContoller (
    scope,
    playIds,
    $mdDialog,
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

    scope.closeDialog = () => {
        $mdDialog.hide();
    };
}

export default BreakdownDialogContoller;
