/* Fetch angular from the browser scope */
const angular = window.angular;

UpdatedTermsAndConditionsController.$inject = [
    'AccountService',
    'DetectDeviceService',
    'SessionService',
    'MobileAppDialog.Service',
    'TermsDialog.Service',
    '$state',
    '$scope'
];

function UpdatedTermsAndConditionsController (
    account,
    detectDevice,
    session,
    MobileAppDialog,
    TermsDialog,
    $state,
    $scope
) {

    $scope.showTerms = function () {

        /* Show the Terms & Conditions Modal */
        TermsDialog.show();
    };

    $scope.acceptTerms = function () {

        /* Get user */
        let user = session.retrieveCurrentUser();

        /* Update the Terms accepted timestamp and redirect to home state. */
        user.updateTermsAcceptedDate();
        user.save();

        /* Is user using an iOS or Android device? */
        let isMobile = detectDevice.iOS() || detectDevice.Android();

        /* If a new user, then only show the mobile app promo dialog. */
        if (isMobile) {

            MobileAppDialog.show().then(() => account.gotoUsersHomeState());
        } else {

            account.gotoUsersHomeState();
        }
    };
}

export default UpdatedTermsAndConditionsController;
