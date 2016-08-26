/**
 * Run Distribution controller class
 * @class RunDistribution
 */

RunDistributionContoller.$inject = [
    '$scope',
    '$modalInstance',
    'IndexerGroups',
    'IndexerFactory'
];

function RunDistributionContoller (
    $scope,
    $modalInstance,
    indexerGroups,
    indexerFactory
) {
    $scope.indexerGroups = indexerGroups;
    $scope.loadingDistributionSummary = true;
    $scope.batchDistributionSummary = {};
    $scope.showMoreDetail = false;

    indexerFactory.createDistriubtionBatchReservation().then(response => {
        $scope.batchDistributionSummary = response.data;
        $scope.loadingDistributionSummary = false;
    });

    $scope.reserveGames = function() {
        indexerFactory.runIndexerGroupDistribution($scope.batchDistributionSummary.id).then(response => {
            $modalInstance.close();
        });
    };

    $scope.getSummaryReportsByGroup = function(summaryReport) {
        let groupReports = [];
        for (var key in summaryReport) {
            if(summaryReport[key].name) {
                groupReports.push(summaryReport[key]);
            }
        }
        return groupReports;
    };

    $scope.getTotalCapForReport = function(summaryReport) {
        let reportsByGroup = $scope.getSummaryReportsByGroup(summaryReport);
        let cap = 0;
        reportsByGroup.forEach(report => {
            cap += report.cap;
        });
        return cap;
    };

    $scope.getDetailReportForGroup = function(selectedGroup, groupReport) {
        if (selectedGroup) {
            for (var key in groupReport) {
                if (groupReport[key].name === selectedGroup.attributes.name) {
                    return groupReport[key];
                }
            }
        } else {
            return groupReport['all'];
        }
    };

    $scope.getDetailTotalsForGroup = function(selectedGroup, groupReport, columnName) {
        let detailReport = $scope.getDetailReportForGroup(selectedGroup, groupReport);
        return detailReport['priority+1'][columnName] + detailReport['priority+2'][columnName] + detailReport['priority+3'][columnName];
    };
}

export default RunDistributionContoller;
