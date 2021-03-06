/* Fetch angular from the browser scope */
const angular = window.angular;
const moment = require('moment');

WeeklyAllocationSettingsController.$inject = [
    '$scope',
    '$rootScope',
    '$filter',
    'IndexerFactory',
    'AllocationSettings.Data',
    'AlertsService'
];

/**
 * Weekly Allocation Settings page controller
 */
function WeeklyAllocationSettingsController(
    $scope,
    $rootScope,
    $filter,
    indexerFactory,
    allocationData,
    alerts
) {
    $scope.selectedWeek = 'current';
    $scope.regex = '0|100';

    $scope.$watch('selectedWeek', function(newV, oldV){
        if(newV == 'next'){
            $scope.startKey = 7;
        }else{
            $scope.startKey = 0;
        }
    });

    $scope.onChangeWeek = function(newV, oldV){
        if($scope.$parent.formSettingChanged){
            $scope.selectedWeek = oldV;
            $scope.$parent.checkState();
            return;
        }
    };

    //count the total number
    $scope.Total = function(i, key){
        let total = 0;
        let items = $scope.weeklyIndexingSettings[i].setting;
        items.forEach((item)=>{
            if(key == 'allocation'){
                total += $scope.projections[i].attributes.projectedBreakdowns * item.attributes.percentage/100;
            }else{
                total += parseInt(item.attributes[key])||0;
            }
        });
        total = Math.round(total);
        return total;
    };

    $scope.checkPercentage = function(idx){
        $scope.projections[idx].percentage = $scope.Total(idx, 'percentage');
    };

    $scope.$watch('formSetting.$pristine', function(newV, oldV){
        if(!newV){
            $scope.$parent.formSettingChanged = true;
        }
    });

    $scope.saveSettings = function(){
        $scope.preSaving = true;
        let updateProjections = false;
        let updateSettings = false;
        let error = null;
        indexerFactory.updateWeeklyIndexingProjections({'sportId': $scope.selectedSportId}, {'data': $scope.projections})
            .then(response=> updateProjections = true)
            .catch(function(){
                error = true;
            });

        indexerFactory.updateIndexingWeeklySettings({'sportId': $scope.selectedSportId}, $scope.weeklyIndexingSettings)
            .then(response=> updateSettings = true)
            .catch(function(){
                error = true;
            });

        $scope.$watch(function checkResult(){
            return updateSettings && updateProjections;
        }, function(newV, oldV){
            if(newV){
                $scope.preSaving = false;
                $scope.$parent.formSettingChanged = false;
                $scope.formSetting.$setPristine();
                alerts.add({
                    type: 'success',
                    message: 'Weekly settings are saved successfully!'
                });
                $rootScope.$broadcast('weeklySettings-saved', $scope.weeklyIndexingSettings);
            }else if(error){
                $scope.preSaving = false;
                alerts.add({
                    type: 'danger',
                    message: 'There\'s error saving weekly setting.'
                });
            }
        });
    };

}

export default WeeklyAllocationSettingsController;
