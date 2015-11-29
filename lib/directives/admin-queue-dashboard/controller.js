const dependencies = [
    'PRIORITIES',
    'PRIORITIES_IDS',
    'LABELS',
    'LABELS_IDS',
    'AdminQueueDashboardService',
    '$scope'
];

function AdminQueueDashboardController(
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

    $scope.PRIORITIES = PRIORITIES;
    $scope.PRIORITIES_IDS = PRIORITIES_IDS;
    $scope.LABELS = LABELS;
    $scope.LABELS_IDS = LABELS_IDS;
    $scope.filterCounts.priorities = priorities;
    $scope.filterCounts.labels = labels;
    $scope.requestQueueFilter = AdminQueueDashboardService.requestQueueFilter;
}

AdminQueueDashboardController.$inject = dependencies;

export default AdminQueueDashboardController;
