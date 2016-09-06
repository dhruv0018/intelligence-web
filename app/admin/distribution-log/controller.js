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

    $scope.searchLogs = function(filter){
        $scope.searching = true;
        $scope.isDefaultState = false;
        $scope.logs = [];

        filter.date = filter.dateTmp.toJSON().slice(0,10);
        $scope.query = IndexerFactory.extendDistributionLog(filter).then(function(distributionLog){
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
        RunDistributionModal.open(id).result.then(() => {
        });
    };
}

export default DistributionLogController;
