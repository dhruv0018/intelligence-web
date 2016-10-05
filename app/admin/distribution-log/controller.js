/* Fetch angular from the browser scope */
const angular = window.angular;

DistributionLogController.$inject = [
    '$scope',
    'DistributionLog.Data',
    'IndexerFactory',
    'SportsFactory',
    'RunDistribution.Modal'
];

/**
* Distribution Log Page controller
*/
function DistributionLogController(
    $scope,
    data,
    IndexerFactory,
    SportsFactory,
    RunDistributionModal
) {
    $scope.logs = data.logs.data;

    let sportIds = Object.keys($scope.logs.logs["1"]);

    $scope.sports = data.sports.filter(function(sport){
        return sportIds.indexOf(sport.id.toString()) > -1;
    });

    IndexerFactory.getIndexerGroups().then(function(response){
        $scope.indexerGroups = response.data;
    });

    $scope.todaysDate = new Date();

    $scope.searchLogs = function(filter) {
        filter = filter || {};
        $scope.searching = true;
        $scope.isDefaultState = false;
        $scope.logs = [];
        let searchDate = {};
        if (filter.dateTmp) {
            searchDate.date = filter.dateTmp.toJSON().slice(0,10);
        } else {
            searchDate.date = new Date().toJSON().slice(0,10);
        }

        $scope.query = IndexerFactory.extendDistributionLog(searchDate).then(function(distributionLog){
            $scope.logs = distributionLog.data;
            sportIds = Object.keys($scope.logs.logs["1"]);
            $scope.sports = data.sports.filter(function(sport){
                return sportIds.indexOf(sport.id.toString()) > -1;
            });

        }).finally(function(){
            $scope.searching = false;
        });
    };

    $scope.openBatchHistory = function(id){
        RunDistributionModal.open($scope.indexerGroups, id).result.then(() => {
        });
    };

    $scope.clearSearchFilter = function(){
        $scope.filter = {};
        $scope.searchLogs({});
    };
}

export default DistributionLogController;
