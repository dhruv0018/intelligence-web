function controller(
    $state,
    $scope,
    alerts
){
    $scope.preSaving = false;

    $scope.saveResource = () => {
        $scope.resource.save(null, null, onSaveFailure).then(onSaveSuccess);
    };

    const SUCCESS_ALERT = {
        type: 'success',
        message: `Changes Saved!`
    };

    const FAILURE_ALERT = {
        type: 'danger',
        message: `Save Unsuccessful`
    };

    let onSaveSuccess = (resource) => {
        const stateName = $state.current.name;
        const stateParams = {
            id: resource.id
        };
        const options = {
            location: true
        };
        const onStateChange = () => alerts.add(SUCCESS_ALERT);
        $state.go(stateName, stateParams, options).then(onStateChange);
    };

    let onSaveFailure = (error) => {
        alerts.add(FAILURE_ALERT);
    };

    $scope.onClick = () => {
        alerts.clear();
        if ($scope.preSave) {
            $scope.preSaving = true;
            $scope.preSave().then($scope.saveResource).finally(() => $scope.preSaving = false);
        } else  {
            $scope.saveResource();
        }
    };
}

controller.$inject = [
    '$state',
    '$scope',
    'AlertsService'
];

export default controller;
