/**
 * SendToQa Controller
 * @module SendToQa
 * @name SendToQa.Controller
 * @type {Controller}
 */

SendToQaController.$inject = [
    '$scope',
    '$uibModalInstance',
    'flagsUrl',
    'showFlags'
];

function SendToQaController(
    $scope,
    $uibModalInstance,
    flagsUrl,
    showFlags
) {
    $scope.isSaving = false;
    $scope.flagsUrl = flagsUrl;
    $scope.showFlags = showFlags;

    $scope.send = function () {
        $uibModalInstance.close(true);
    };

    $scope.dismiss = function() {
        $uibModalInstance.close(false);
    };
}

export default SendToQaController;
