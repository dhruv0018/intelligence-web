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
    'DetectDeviceService',
    'SessionService',
    'MOBILE_APP_URLS',
    'ROLE_TYPE'
];

function MobileAppDialogController(
    $rootScope,
    $scope,
    $mdDialog,
    detectDevice,
    session,
    MOBILE_APP_URLS,
    ROLE_TYPE
) {

    let user               = session.retrieveCurrentUser();
    let role               = user.getCurrentRole();

    $scope.DEVICE          = $rootScope.DEVICE;
    $scope.MOBILE_APP_URLS = MOBILE_APP_URLS;
    $scope.isCoach         = user.is(ROLES.COACH);
    $scope.isAthlete       = user.is(ROLES.ATHLETE);
    $scope.dismiss         = () => $mdDialog.hide();
}

export default MobileAppDialogController;
