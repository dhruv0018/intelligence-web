const dependencies = [
    'PRIORITIES',
    'PRIORITIES_IDS',
    'LABELS',
    'LABELS_IDS',
    '$scope'
];

function AdminQueueDashboardController(
    PRIORITIES,
    PRIORITIES_IDS,
    LABELS,
    LABELS_IDS,
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
    $scope.LABELS = LABELS;
    $scope.filterCounts.priorities = priorities;
    $scope.filterCounts.labels = labels;
    $scope.requestQueueFilter = requestQueueFilter;
}

function requestQueueFilter() {}

AdminQueueDashboardController.$inject = dependencies;

export default AdminQueueDashboardController;
