let moment = require('moment');

/* Fetch angular from the browser scope */
let angular = window.angular;


controller.$inject = [
    'PRIORITIES',
    'PRIORITIES_IDS',
    'LABELS',
    'LABELS_IDS',
    '$scope',
    'SessionService',
    'GAME_STATUSES',
    'TeamsFactory'
];

function controller(
    PRIORITIES,
    PRIORITIES_IDS,
    LABELS,
    LABELS_IDS,
    $scope,
    session,
    GAME_STATUSES,
    teams
){

    $scope.PRIORITIES = PRIORITIES;
    $scope.LABELS = LABELS;
    $scope.showDashboard = true;
    $scope.toggleDashboard = () => {
        $scope.showDashboard = !$scope.showDashboard;
    };

    let labelsQueueFilters = {};
    Object.keys(LABELS_IDS).forEach(key => labelsQueueFilters[key] = []);

    let priorityQueueFilters = {};
    Object.keys(PRIORITIES_IDS).forEach(key => priorityQueueFilters[key] = []);

    $scope.queueFilters = {
        labels: labelsQueueFilters,
        priority: priorityQueueFilters,
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
        assigned: {
            qa: [],
            indexing: []
        },
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

        if (team.label) {

            let labelId = LABELS[LABELS_IDS[team.label]].id;

            $scope.queueFilters.labels[labelId].push(game);
        }

        if (game.priority) {

            $scope.queueFilters.priority[game.priority].push(game);
        }

        game.remainingTime = game.getRemainingTime(team, now);

        let remainingHours = moment.duration(game.remainingTime).asHours();

        let assignment = game.currentAssignment();

        if (game.status === GAME_STATUSES.READY_FOR_INDEXING.id) {
            $scope.queueFilters.ready.indexing.push(game);
        } else if (game.status === GAME_STATUSES.READY_FOR_QA.id) {
            $scope.queueFilters.ready.qa.push(game);
        }

        if (assignment && !assignment.timeFinished) {

            if (game.status === GAME_STATUSES.INDEXING.id) {

                $scope.queueFilters.assigned.indexing.push(game);
            } else if (game.status === GAME_STATUSES.QAING.id) {

                $scope.queueFilters.assigned.qa.push(game);
            }
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
