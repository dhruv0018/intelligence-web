AppDownloadController.$inject = [
    '$rootScope',
    '$scope',
    'MOBILE_APP_URLS'
];

function AppDownloadController (
    $rootScope,
    $scope,
    MOBILE_APP_URLS
) {

    $scope.DEVICE = $rootScope.DEVICE;
    $scope.MOBILE_APP_URLS = MOBILE_APP_URLS;
}

export default AppDownloadController;
