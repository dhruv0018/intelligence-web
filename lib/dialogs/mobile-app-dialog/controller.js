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
    $scope.isCoach         = role.type.id === ROLE_TYPE.COACH || role.type.id === ROLE_TYPE.HEAD_COACH || role.type.id === ROLE_TYPE.ASSISTANT_COACH;
    $scope.isAthlete       = role.type.id === ROLE_TYPE.ATHLETE;
    $scope.dismiss         = () => $mdDialog.hide();
}

export default MobileAppDialogController;
