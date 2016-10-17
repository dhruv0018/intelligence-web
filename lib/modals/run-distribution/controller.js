/**
 * Run Distribution controller class
 * @class RunDistribution
 */

RunDistributionController.$inject = [
    '$scope',
    '$modalInstance',
    'IndexerGroups',
    'IndexerFactory',
    'AlertsService',
    'batchID'
];

function RunDistributionController (
    $scope,
    $modalInstance,
    indexerGroups,
    indexerFactory,
    alerts,
    batchID
) {
    $scope.indexerGroups = indexerGroups;
    $scope.batchDistributionSummary = {};
    $scope.loadingDistributionSummary = true;
    $scope.noGamesToDistribute = false;
    $scope.showMoreDetail = false;
    $scope.reservingGames = false;
    $scope.batchID = batchID;
    $scope.batchHistory = false;

    if(!$scope.batchID){
        indexerFactory.createDistriubtionBatchReservation().then(
            response => {
                $scope.batchDistributionSummary = response.data;
                $scope.loadingDistributionSummary = false;

                if(!response.data.id) {
                    $scope.noGamesToDistribute = true;
                }
            },
            error => {
                alerts.add({
                    type: 'danger',
                    message: error.data.title
                });
                $modalInstance.dismiss();
            }
        );
    }else{
        $scope.batchHistory = true;
        indexerFactory.getDistributionBatchHistory($scope.batchID).then(
            response => {
                $scope.batchDistributionSummary = response.data;
                $scope.loadingDistributionSummary = false;
            },
            error =>{
                alerts.add({
                    type: 'danger',
                    message: error.data.title
                });
                $modalInstance.dismiss();
            }
        );
    }

    $scope.reserveGames = function() {
        $scope.reservingGames = true;
        indexerFactory.runIndexerGroupDistribution($scope.batchDistributionSummary.id).then(
            response => {
                $scope.reservingGames = false;
                alerts.add({
                    type: 'success',
                    message: 'Games distributed successfully!'
                });
                $modalInstance.close();
            },
            error => {
                alerts.add({
                    type: 'danger',
                    message: error.data.title
                });
                $modalInstance.dismiss();
            }
        );
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
        if (detailReport) {
            return detailReport['priority+1'][columnName] + detailReport['priority+2'][columnName] + detailReport['priority+3'][columnName];
        }else{
            return null;
        }
    };
}

export default RunDistributionController;
