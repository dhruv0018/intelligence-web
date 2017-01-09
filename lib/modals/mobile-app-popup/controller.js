/**
 * MobileAppPopup Controller
 * @module MobileAppPopup
 * @name MobileAppPopup.Controller
 * @type {Controller}
 */

MobileAppPopupController.$inject = [
    '$rootScope',
    '$scope',
    '$uibModalInstance',
    'SessionService'
];

function MobileAppPopupController(
    $rootScope,
    $scope,
    $uibModalInstance,
    session
) {

    $scope.dismiss = () => $uibModalInstance.close();
}

export default MobileAppPopupController;
