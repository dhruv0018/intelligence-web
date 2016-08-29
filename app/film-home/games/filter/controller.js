GameFilterController.$inject = [
    '$scope',
    '$element',
    'AnalyticsService'
];

function GameFilterController (
    $scope,
    $element,
    analytics
) {
    $scope.applyDisabled = true;
    let tmpFilters;

    $scope.toggleFilter = function($event, filter) {
        $event.stopPropagation();
        if($scope.applyDisabled){
            tmpFilters = angular.copy($scope.filters);
        }
        //Do not allow 'all' filter to be manully clicked
        if(filter != 'all'){
            $scope.filters[filter] = !$scope.filters[filter];
            if($scope.filters['all']){
                $scope.filters['all'] = false;
            }
        }else{
            if($scope.checkIndeterminate()){
                $scope.filters = {'all': true};
            }else{
                return;
            }
        }
        //if all other filters are unchecked, 'all' should automatically be checked
        let filterExist = false;
        angular.forEach($scope.filters, (value, key)=>{
            if(!filterExist){
                if(value){
                    filterExist= true;
                }
            }
        });
        if(!filterExist){
            $scope.filters['all'] = true;
        }
        $scope.applyDisabled = false;
    };

    $scope.cancel = function() {
        $scope.filters = tmpFilters;
        $scope.applyDisabled = true;
    };

    //if click outside the dropdown treat as cancel
    $scope.$watch('status.isopen', function(newV, oldV){
        if(!newV && oldV && !$scope.applyDisabled){
            $scope.cancel();
        }
    });

    $scope.checkIndeterminate = function() {
        let indeterminate = false;
        angular.forEach($scope.filters, (item, key) =>{
            if(key != 'all' && item){
                indeterminate =  true;
            }
        });
        return indeterminate;
    };

    $scope.applyFilter = function() {
        // Creates array for mixpanel tracking
        let filterNames = [];
        if ($scope.filters['all']) {
            filterNames.push('All Games');
        }
        if ($scope.filters['my']) {
            filterNames.push('My Games');
        }
        if ($scope.filters['scouting']) {
            filterNames.push('Scouting');
        }
        if ($scope.filters['conference']) {
            filterNames.push('Conference');
        }
        if ($scope.filters['breakdown']) {
            filterNames.push('Breakdown');
        }
        if ($scope.filters['shared']) {
            filterNames.push('Shared With Me');
        }
        if ($scope.filters['selfEditor']) {
            filterNames.push('Used Film Editor');
        }

        analytics.track('Film Home Filtered', {
            'Film Filter Names': filterNames
        });

        tmpFilters = angular.copy($scope.filters);
        $scope.applyDisabled = true;
        $scope.$emit('applyFilter', $scope.filters);
    };

    $scope.reset = function() {
        $scope.filters = {'all': true};
        $scope.$emit('applyFilter', $scope.filters);
    };

}

export default GameFilterController;
