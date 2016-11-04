/* Fetch angular from the browser scope */
const angular = window.angular;

UpdatedTermsAndConditionsController.$inject = [
    'AccountService',
    'SessionService',
    'TermsPopup.Modal',
    '$state',
    '$scope'
];

function UpdatedTermsAndConditionsController (
    account,
    session,
    TermsPopup,
    $state,
    $scope
) {

    $scope.showTerms = function (event) {

        /* Show the Terms & Conditions Modal */
        event.stopPropagation();
        TermsPopup.open();
    };

    $scope.acceptTerms = function () {

        /* Get user */
        let user = session.retrieveCurrentUser();

        /* Update the Terms accepted timestamp and redirect to home state. */
        user.updateTermsAcceptedDate();
        user.save();

        account.gotoUsersHomeState();
    };
}

export default UpdatedTermsAndConditionsController;
