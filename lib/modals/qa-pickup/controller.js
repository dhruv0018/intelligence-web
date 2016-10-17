const angular = window.angular;
const moment = require('moment');

/**
 * QA Pickup controller class
 * @class QAPickup
 */

QaPickupController.$inject = [
    '$scope',
    '$state',
    '$window',
    '$modalInstance',
    'Utilities',
    'GamesFactory',
    'game',
    'TeamsFactory',
    'LeaguesFactory',
    'SportsFactory',
    'SessionService',
    'config',
    'LABELS',
    'LABELS_IDS',
    'PRIORITIES',
    'PRIORITIES_IDS',
    'VIEWS'
];

function QaPickupController (
    $scope,
    $state,
    $window,
    $modalInstance,
    utilities,
    games,
    game,
    teams,
    leagues,
    sports,
    session,
    config,
    LABELS,
    LABELS_IDS,
    PRIORITIES,
    PRIORITIES_IDS,
    VIEWS
) {
    $scope.LABELS_IDS = LABELS_IDS;
    $scope.LABELS = LABELS;
    $scope.PRIORITIES = PRIORITIES;
    $scope.PRIORITIES_IDS = PRIORITIES_IDS;

    const gameId = game.id;
    const currentUserId =  session.getCurrentUserId();
    const now = moment.utc();
    const deadlinePassed = config.hours.qaPickup.deadlinePassed;

    $scope.game = games.get(gameId);
    $scope.team = teams.get($scope.game.teamId);
    $scope.opposingTeam = teams.get($scope.game.opposingTeamId);
    $scope.assignmentHours = config.hours.qaPickup.deadlinePassed;

    const uploaderTeam = teams.get($scope.game.uploaderTeamId);
    $scope.uploaderTeam = uploaderTeam;
    $scope.game.timeRemaining = $scope.game.timeRemaining();

    const league = leagues.get($scope.team.leagueId);
    $scope.sport = sports.get(league.sportId);
    $scope.successfulPickup = false;
    $scope.gameAlreadyTaken = false;
    $scope.refreshGames = function() {

        games.load([
            games.load(VIEWS.QUEUE.GAME.PRIORITY_1),
            games.load(VIEWS.QUEUE.GAME.PRIORITY_2),
            games.load(VIEWS.QUEUE.GAME.PRIORITY_3)
        ])
        .then(() => {

            let games = games.getList(VIEWS.QUEUE.GAME.PRIORITY_3)
                .concat(games.getList(VIEWS.QUEUE.GAME.PRIORITY_2))
                .concat(games.getList(VIEWS.QUEUE.GAME.PRIORITY_1));

            $modalInstance.close(games);
        });
    };
    $scope.pickUpGame = function(pickUpAndGo) {
        //check for update to game and if someone has already
        //picked up the game for qaing

        games.fetch(gameId).then(function(updatedGame) {
            let currentAssignment = updatedGame.currentAssignment();
            if(currentAssignment.isQa && currentAssignment.userId !== currentUserId) {
                $scope.gameAlreadyTaken = true;
            } else {
                let deadline;
                if($scope.game.timeRemaining > 0) {
                    deadline = $scope.game.getDeadlineToReturnGame(uploaderTeam);
                } else {
                    deadline = now.add(deadlinePassed, 'hours').format();
                }

                $scope.game.assignToQa(currentUserId, deadline);
                $scope.game.save();
                if(pickUpAndGo) {
                    $modalInstance.dismiss();
                    $state.go('IndexerGame', { id: gameId });
                } else {
                    $scope.successfulPickup = true;
                }
            }
        });
    };
}

export default QaPickupController;
