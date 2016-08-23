const dependencies = [
    'EVENT',
    'GamesResolutionEventEmitter',
    'PRIORITIES',
    'PRIORITIES_IDS',
    'LABELS',
    'LABELS_IDS',
    'AdminQueueDashboardService',
    '$scope'
];

function AdminQueueDashboardController(
    EVENT,
    GamesResolutionEventEmitter,
    PRIORITIES,
    PRIORITIES_IDS,
    LABELS,
    LABELS_IDS,
    AdminQueueDashboardService,
    $scope
){

    const priorityIds = Object.keys(PRIORITIES_IDS);
    const priorities = {};
    priorities[priorityIds[0]] = $scope.filterCounts.normalPriority;
    priorities[priorityIds[1]] = $scope.filterCounts.highPriority;
    priorities[priorityIds[2]] = $scope.filterCounts.highestPriority;

    const labelIds = Object.keys(LABELS_IDS);
    const labels = {};
    labels[labelIds[0]] = $scope.filterCounts.krossoverLite;
    labels[labelIds[1]] = $scope.filterCounts.coachBreakdown;
    labels[labelIds[2]] = $scope.filterCounts.coachComplaint;
    labels[labelIds[3]] = $scope.filterCounts.hyperTurnaround;
    labels[labelIds[4]] = $scope.filterCounts.custom1;
    labels[labelIds[5]] = $scope.filterCounts.custom2;

    $scope.PRIORITIES = PRIORITIES;
    $scope.PRIORITIES_IDS = PRIORITIES_IDS;
    $scope.LABELS = LABELS;
    $scope.LABELS_IDS = LABELS_IDS;
    $scope.filterCounts.priorities = priorities;
    $scope.filterCounts.labels = labels;
    $scope.requestQueueFilter = AdminQueueDashboardService.requestQueueFilter;

    $scope.FILTERS = AdminQueueDashboardService.FILTERS;
    $scope.selectedFilter = $scope.FILTERS.TOTAL.id;
    $scope.selectFilter = selectFilter;

    function selectFilter (filter) {

        $scope.selectedFilter = filter.id;
        $scope.$emit('select-dashboard-filter', event);
    }

    GamesResolutionEventEmitter.on(EVENT.ADMIN.DASHBOARD.RESET_FILTERS, () =>  {

        $scope.selectedFilter = null;
    });
}

AdminQueueDashboardController.$inject = dependencies;

export default AdminQueueDashboardController;
