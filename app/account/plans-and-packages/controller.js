const angular = window.angular;

PlansAndPackagesController.$inject = [
    '$scope',
    '$filter',
    'TeamsFactory',
    'SessionService',
    'BreakdownPurchase.Modal',
    'Account.Data',
    'TURNAROUND_TIME_MIN_TIME_LOOKUP'
];

/**
 * Account Plans and Packages page controller
 */
function PlansAndPackagesController(
    $scope,
    $filter,
    teamsFactory,
    session,
    breakdownPurchaseModal,
    data,
    minTurnaroundTimeLookup
) {
    let team = teamsFactory.get(session.currentUser.getCurrentRole().teamId);
    let teamId = team.id;
    $scope.plan = data.remainingBreakdowns.plan;
    $scope.package = data.remainingBreakdowns.package;
    $scope.planGamesRemaining = data.remainingBreakdowns.planGamesRemaining;
    $scope.packageGamesRemaining = data.remainingBreakdowns.packageGamesRemaining;
    $scope.minTurnaroundTimeLookup = minTurnaroundTimeLookup;

    $scope.getUsedPlanGames = function() {
        return $scope.package.maxGamesPerPlan - $scope.planGamesRemaining;
    };

    $scope.getUsedPackageGames = function() {
        return $scope.package.maxGamesPerPackage - $scope.packageGamesRemaining;
    };

    $scope.openBreakdownPurchaseModal = function() {
        breakdownPurchaseModal.open(data.products, updateRemainingBreakdowns);
    };

    function updateRemainingBreakdowns() {
        teamsFactory.getRemainingBreakdowns(teamId).then(breakdownData => {
            session.currentUser.remainingBreakdowns = breakdownData;
            data.remainingBreakdowns = breakdownData;
            $scope.plan = breakdownData.plan;
            $scope.package = breakdownData.package;
            $scope.planGamesRemaining = breakdownData.planGamesRemaining;
            $scope.packageGamesRemaining = breakdownData.packageGamesRemaining;
        });
    }
}

export default PlansAndPackagesController;
