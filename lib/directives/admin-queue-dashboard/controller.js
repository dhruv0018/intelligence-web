let moment = require('moment');

/* Fetch angular from the browser scope */
let angular = window.angular;


controller.$inject = [
    '$scope',
    'SessionService',
    'GAME_STATUSES',
    'TeamsFactory'
];

function controller($scope, session, GAME_STATUSES, teams) {
    $scope.showDashboard = true;
    $scope.toggleDashboard = () => {
        $scope.showDashboard = !$scope.showDashboard;
    };

    $scope.queueFilters = {
        remaining: {
            '48': [],
            '24': [],
            '10': [],
            '5': [],
            '1': [],
            'late': []
        },
        ready: {
            qa: [],
            indexing: []
        },
        setAside: [],
        assigned: [],
        unassigned: [],
        processing: {
            inProcessing: [],
            failed: []
        },
        'last48': {
            uploaded: [],
            delivered: []
        }
    };

    let now = moment.utc();

    //sorting games into filter categories
    angular.forEach($scope.queue, function(game) {

        let team = teams.get(game.uploaderTeamId);
        game.remainingTime = game.getRemainingTime(team, now);

        let remainingHours = moment.duration(game.remainingTime).asHours();

        let assignment = game.currentAssignment();

        if (game.status === GAME_STATUSES.READY_FOR_INDEXING.id) {
            $scope.queueFilters.ready.indexing.push(game);
        } else if (game.status === GAME_STATUSES.READY_FOR_QA.id) {
            $scope.queueFilters.ready.qa.push(game);
        }

        if (typeof assignment === 'undefined' || (assignment && assignment.timeFinished && game.status !== GAME_STATUSES.INDEXED.id)) {
            $scope.queueFilters.unassigned.push(game);
        } else if (assignment && !assignment.timeFinished) {
            $scope.queueFilters.assigned.push(game);
        }

        if (!game.isDelivered()) {
            if (game.remainingTime < 0) {
                $scope.queueFilters.remaining.late.push(game);
            } else if (remainingHours >= 24 && remainingHours <= 48) {
                $scope.queueFilters.remaining['48'].push(game);
            } else if (remainingHours < 24 && remainingHours >= 10) {
                $scope.queueFilters.remaining['24'].push(game);
            } else if (remainingHours < 10 && remainingHours >= 5) {
                $scope.queueFilters.remaining['10'].push(game);
            } else if (remainingHours < 5 && remainingHours >= 1) {
                $scope.queueFilters.remaining['5'].push(game);
            } else if (remainingHours < 1 && remainingHours !== 0) {
                $scope.queueFilters.remaining['1'].push(game);
            }
        }
    });

    $scope.setQueue = function(games) {
        $scope.queue = games;
    };
}

export default controller;
