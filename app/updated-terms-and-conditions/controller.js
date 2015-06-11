/* Fetch angular from the browser scope */
const angular = window.angular;

UpdatedTermsAndConditionsController.$inject = [
    '$scope',
    '$state',
    'TermsDialog.Service',
    'SessionService',
    'AccountService'
];

function UpdatedTermsAndConditionsController (
    $scope,
    $state,
    TermsDialog,
    session,
    account
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
        account.gotoUsersHomeState();
    };
}

export default UpdatedTermsAndConditionsController;
