/**
 * SendToQaDialog Controller
 * @module TermsDialog
 * @name TermsDialog.Controller
 * @type {Controller}
 */

SendToQaDialogController.$inject = [
    '$scope',
    '$mdDialog',
    'sendToQa',
    'flagsUrl',
    'showFlags'
];

function SendToQaDialogController(
    $scope,
    $mdDialog,
    sendToQa,
    flagsUrl,
    showFlags
) {
    $scope.isSaving = false;
    $scope.flagsUrl = flagsUrl;
    $scope.showFlags = showFlags;

    $scope.close = function () {
        $scope.isSaving = true;
        sendToQa().then(() => {
            $scope.isSaving = false;
        });
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
}

export default SendToQaDialogController;
