/**
 * TermsPopup Controller
 * @module TermsPopup
 * @name TermsPopup.Controller
 * @type {Controller}
 */

TermsPopupController.$inject = [
    '$scope',
    '$uibModalInstance'
];

function TermsPopupController(
    $scope,
    $uibModalInstance
) {

    $scope.closeTerms = function closeTerms () {

        return $uibModalInstance.close();
    };
}

export default TermsPopupController;
