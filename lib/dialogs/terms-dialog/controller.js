const termsTemplateUrl       = 'terms-dialog/terms.html';

/**
 * TermsDialog Controller
 * @module TermsDialog
 * @name TermsDialog.Controller
 * @type {Controller}
 */

TermsDialogController.$inject = [
    '$scope',
    '$mdDialog',
    'prompt'
];

function TermsDialogController(
    $scope,
    $mdDialog,
    prompt
) {

    $scope.promptUser = prompt;

    $scope.closeTerms = function closeTerms () {

        if (prompt) {

            $scope.promptUser = true;
        } else {

            return $mdDialog.hide();
        }
    };

    $scope.acceptTerms = () => $mdDialog.hide();

    $scope.showTerms = () => $scope.promptUser = false;
}

export default TermsDialogController;
