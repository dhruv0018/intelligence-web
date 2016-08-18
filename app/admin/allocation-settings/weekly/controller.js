/* Fetch angular from the browser scope */
const angular = window.angular;
const moment = require('moment');

WeeklyAllocationSettingsController.$inject = [
    '$scope',
    '$filter',
    'IndexerFactory',
    'AllocationSettings.Data'
];

/**
 * Weekly Allocation Settings page controller
 */
function WeeklyAllocationSettingsController(
    $scope,
    $filter,
    indexerFactory,
    allocationData
) {

    $scope.selectedWeek = 'current';
    $scope.projections = allocationData.weeklyIndexingProjections.data;
    $scope.weeklyIndexingSettings = allocationData.weeklyIndexingSettings;

    $scope.$watch('selectedWeek', function(newV, oldV){
        if(newV == 'next'){
            $scope.startKey = 7;
        }else{
            $scope.startKey = 0;
        }
    });

    //fetch data based on selected sport id
    $scope.$on('on-sport-selected', event => {
        let today = moment.utc(new Date().toJSON().slice(0,10));
        indexerFactory.getWeeklyIndexingProjections({'sportId': $scope.selectedSportId}).then(function(indexingProjections){
            angular.forEach(indexingProjections.data, function(item){
                item.isActive = moment(item.attributes.date).isAfter(today) || moment(item.attributes.date).isSame(today);
                item.dateString = (item.attributes.date).toString().slice(0,10);
            });
            $scope.projections = indexingProjections.data;

            indexerFactory.extendWeeklySettings({'sportId': $scope.selectedSportId}).then(function(weeklySettings){
                $scope.weeklyIndexingSettings = weeklySettings;
                $scope.isLoadingNewSport = false;
            });

        });
    });

    //count the total number
    $scope.Total = function(i, key){
        let total = 0;
        let items = $scope.weeklyIndexingSettings[i].setting;
        items.forEach((item)=>{
            if(key == 'allocation'){
                total += $scope.projections[i].attributes.projectedBreakdowns * item.attributes.percentage/100;
            }else{
                total += parseInt(item.attributes[key]);
            }
        });
        return total;
    };

    $scope.checkPercentage = function(idx){
        console.log('checkPercentage', idx, $scope.Total(idx, 'percentage'));

        if($scope.Total(idx, 'percentage')!= 100){
            console.log($scope.formSetting);
            // $scope.formSetting.$setValidity('required', false);
        }
    };

    $scope.saveSettings = function(){
        indexerFactory.updateWeeklyIndexingProjections({'sportId': $scope.selectedSportId}, {'data': $scope.projections});

        indexerFactory.updateIndexingWeeklySettings({'sportId': $scope.selectedSportId}, $scope.weeklyIndexingSettings);
    };
}

export default WeeklyAllocationSettingsController;
