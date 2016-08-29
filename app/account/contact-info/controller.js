const angular = window.angular;

ContactInfoController.$inject = [
    '$scope',
    '$timeout',
    'SessionService',
    'ChangeEmail.Modal',
    'CancelChangeEmail.Modal'
];

/**
 * Account Contact Info page controller
 */
function ContactInfoController(
    $scope,
    $timeout,
    session,
    changeEmailModal,
    cancelChangeEmailModal
) {
    let currentUser = session.getCurrentUser();

    currentUser.changeEmailStatus()
        .then(function(response){
            $scope.emailChange = response;
        })
        .catch(function(){
            $scope.emailChange = false;
        });

    $scope.sendRequest = function(){
        let modal = changeEmailModal.open();

        modal.result.then((result) =>{
            $scope.emailChange = result;
        });
    };

    $scope.resendRequest = function(){
        $scope.resendEmail = true;
        currentUser.resendEmailChange()
            .then(function(response){
                $timeout(function(){
                    $scope.emailSent = true;
                },1000);
                $timeout(function(){
                    $scope.resendEmail = false;
                    $scope.emailSent = false;
                },2500);
            }, function(){
                throw new Error('error resend email request');
            });
    };

    $scope.cancelRequest = function(){
        let modal = cancelChangeEmailModal.open();

        modal.result.then( (result) => {
            currentUser.cancelEmailChange()
                .then(function(response){
                    $scope.emailChange = false;
                }, function(){
                    throw new Error('error cancel request');
                });
        });
    };
}

export default ContactInfoController;
