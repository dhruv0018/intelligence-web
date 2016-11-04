/**
 * SendToQa Controller
 * @module SendToQa
 * @name SendToQa.Controller
 * @type {Controller}
 */

SendToQaController.$inject = [
    '$scope',
    '$modalInstance',
    'flagsUrl',
    'showFlags'
];

function SendToQaController(
    $scope,
    $modalInstance,
    flagsUrl,
    showFlags
) {
    $scope.isSaving = false;
    $scope.flagsUrl = flagsUrl;
    $scope.showFlags = showFlags;

    $scope.send = function () {
        $modalInstance.close(true);
    };

    $scope.dismiss = function() {
        $modalInstance.close(false);
    };
}

export default SendToQaController;
