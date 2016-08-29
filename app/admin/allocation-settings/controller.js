/* Fetch angular from the browser scope */
const angular = window.angular;
const moment = require('moment');

AllocationSettingsController.$inject = [
    '$scope',
    'AllocationSettings.Data',
    'SportsFactory',
    'IndexerFactory',
    'ALLOCATION_TYPES',
    'BasicModals'
];

/**
 * Allocation Settings page controller
 */
function AllocationSettingsController(
    $scope,
    data,
    sports,
    indexerFactory,
    ALLOCATION_TYPES,
    basicModals
) {
    $scope.ALLOCATION_TYPES = ALLOCATION_TYPES;
    $scope.sports = sports.getList();

    $scope.selectedSportId = $scope.sports[0].id;
    $scope.indexerGroups = data.indexerGroups.data;
    $scope.indexerGroupAllocationTypes = data.indexerGroupAllocationTypes.data;
    $scope.indexerGroupsAllocationPermissions = data.indexerGroupsAllocationPermissions;

    $scope.projections = data.weeklyIndexingProjections.data;
    $scope.weeklyIndexingSettings = data.weeklyIndexingSettings;

    $scope.isLoadingNewSport = false;

    $scope.indexerPercentage = indexerPercentage($scope.weeklyIndexingSettings);

    $scope.frmGeneralChanged = false;
    $scope.formSettingChanged = false;

    $scope.$on('weeklySettings-saved', function(event, weeklySettings){
        $scope.weeklyIndexingSettings = weeklySettings;
        $scope.indexerPercentage = indexerPercentage(weeklySettings);
    });

    $scope.checkState = function($event){
        if($scope.frmGeneralChanged || $scope.formSettingChanged){
            if ($event) {$event.preventDefault();}
            let saveModal = basicModals.openForAlert({
                title: 'Unsaved Changes',
                bodyText: 'You have unsaved changes on this page. Please save your settings before continuing.',
                buttonText: 'Ok'
            });
        }
    };

    function indexerPercentage(settings){
        let percentages = {};
        settings.forEach(weeklySetting =>{
            for(let i=0; i< $scope.indexerGroups.length; i++){
                if (!percentages[weeklySetting.setting[i].attributes.indexerGroup] && weeklySetting.setting[i].attributes.percentage >0) {
                    percentages[weeklySetting.setting[i].attributes.indexerGroup] = true;
                }
            }
        });
        return percentages;
    }

    $scope.onChangeSelectedSportId = function(newV, oldV) {
        if($scope.frmGeneralChanged || $scope.formSettingChanged){
            $scope.selectedSportId = oldV;
            $scope.checkState();
            return;
        }
        $scope.isLoadingNewSport = true;

        indexerFactory.getIndexerGroupsAllocationPermissions($scope.selectedSportId).then(response => {
            $scope.indexerGroupsAllocationPermissions.data = response.data;
        });

        let today = moment.utc(new Date().toJSON().slice(0,10));
        indexerFactory.getWeeklyIndexingProjections({'sportId': $scope.selectedSportId}).then(function(indexingProjections){
            angular.forEach(indexingProjections.data, function(item){
                item.isActive = moment(item.attributes.date).isAfter(today) || moment(item.attributes.date).isSame(today);
                item.dateString = (item.attributes.date).toString().slice(0,10);
            });
            $scope.projections = indexingProjections.data;

            indexerFactory.extendWeeklySettings({'sportId': $scope.selectedSportId}).then(function(weeklySettings){
                $scope.weeklyIndexingSettings = weeklySettings;
                $scope.indexerPercentage = indexerPercentage($scope.weeklyIndexingSettings);
                $scope.isLoadingNewSport = false;
            });

        });
    };

    $scope.groupHasPermission = function(indexerGroup, allocationTypeId) {
        if(typeof indexerGroup === 'object'){
            indexerGroup = indexerGroup.attributes.name;
        }

        return data.indexerGroupsAllocationPermissions.data.some(permission => {
            if (permission.attributes.name === indexerGroup && permission.attributes.sports[$scope.selectedSportId]) {
                return permission.attributes.sports[$scope.selectedSportId].some(permissionId => {
                    return permissionId === allocationTypeId;
                });
            }
        });
    };
}

export default AllocationSettingsController;
