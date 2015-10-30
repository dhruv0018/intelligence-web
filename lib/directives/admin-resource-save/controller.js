function controller($scope, alerts) {
    const SUCCESS_ALERT = {
        type: 'success',
        message: `Changes Saved!`
    };

    const FAILURE_ALERT = {
        type: 'danger',
        message: `Save Unsuccessful`
    };

    let onSaveSuccess = () => alerts.add(SUCCESS_ALERT);
    let onSaveFailure = () => alerts.add(FAILURE_ALERT);
    $scope.onClick = () => {
        alerts.clear();
        $scope.resource.save().then(onSaveSuccess, onSaveFailure);
    };
}

controller.$inject = ['$scope', 'AlertsService'];

export default controller;
