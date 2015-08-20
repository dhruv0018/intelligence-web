const termsTemplateUrl       = 'terms-dialog/terms.html';

/**
 * TermsDialog Controller
 * @module TermsDialog
 * @name TermsDialog.Controller
 * @type {Controller}
 */

TermsDialogController.$inject = [
    '$scope',
    '$mdDialog'
];

function TermsDialogController(
    $scope,
    $mdDialog
) {

    $scope.closeTerms = function closeTerms () {

        return $mdDialog.hide();
    };
}

export default TermsDialogController;
