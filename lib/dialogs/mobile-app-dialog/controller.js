/**
 * MobileAppDialog Controller
 * @module MobileAppDialog
 * @name MobileAppDialog.Controller
 * @type {Controller}
 */

MobileAppDialogController.$inject = [
    '$rootScope',
    '$scope',
    '$mdDialog',
    'SessionService'
];

function MobileAppDialogController(
    $rootScope,
    $scope,
    $mdDialog,
    session
) {

    $scope.dismiss         = () => $mdDialog.hide();
}

export default MobileAppDialogController;
