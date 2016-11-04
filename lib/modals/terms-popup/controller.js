/**
 * TermsPopup Controller
 * @module TermsPopup
 * @name TermsPopup.Controller
 * @type {Controller}
 */

TermsPopupController.$inject = [
    '$scope',
    '$modalInstance'
];

function TermsPopupController(
    $scope,
    $modalInstance
) {

    $scope.closeTerms = function closeTerms () {

        return $modalInstance.close();
    };
}

export default TermsPopupController;
