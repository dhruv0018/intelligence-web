function controller(
    $state,
    $scope,
    alerts
){

    const SUCCESS_ALERT = {
        type: 'success',
        message: `Changes Saved!`
    };

    const FAILURE_ALERT = {
        type: 'danger',
        message: `Save Unsuccessful`
    };

    let onSaveSuccess = (resource) => {
        $state.go(
                $state.current.name,
                {id: resource.id},
                {location: true}
            ).then(() => alerts.add(SUCCESS_ALERT));
    };

    let onSaveFailure = (error) => {
        alerts.add(FAILURE_ALERT);
    };

    $scope.onClick = () => {
        alerts.clear();
        $scope.resource.save(null, null, onSaveFailure).then(onSaveSuccess);
    };
}

controller.$inject = [
    '$state',
    '$scope',
    'AlertsService'
];

export default controller;
