/**
 * MobileAppDialog Controller
 * @module MobileAppDialog
 * @name MobileAppDialog.Controller
 * @type {Controller}
 */

MobileAppDialogController.$inject = [
    '$scope',
    '$mdDialog',
    'DetectDeviceService',
    'MOBILE_APP_URLS'
];

function MobileAppDialogController(
    $scope,
    $mdDialog,
    detectDevice,
    MOBILE_APP_URLS
) {

    $scope.MOBILE_APP_URLS = MOBILE_APP_URLS;
    if (detectDevice.iOS()) $scope.device = 'IOS';
    else if (detectDevice.Android()) $scope.device = 'ANDROID';

    $scope.dismiss = () => $mdDialog.hide();
}

export default MobileAppDialogController;
