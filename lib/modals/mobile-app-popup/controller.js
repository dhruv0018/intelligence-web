/**
 * MobileAppPopup Controller
 * @module MobileAppPopup
 * @name MobileAppPopup.Controller
 * @type {Controller}
 */

MobileAppPopupController.$inject = [
    '$rootScope',
    '$scope',
    '$modalInstance',
    'SessionService'
];

function MobileAppPopupController(
    $rootScope,
    $scope,
    $modalInstance,
    session
) {

    $scope.dismiss = () => $modalInstance.close();
}

export default MobileAppPopupController;
