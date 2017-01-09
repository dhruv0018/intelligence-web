/* Fetch angular from the browser scope */
var angular = window.angular;

IndexingModalDeletePlayController.$inject = [
    '$scope',
    '$uibModalInstance'
];

/**
 * Modal controller. Controls the modal view.
 * @module Indexing
 * @name Modal.DeletePlay.Controller
 * @type {Controller}
 */
function IndexingModalDeletePlayController($scope, $uibModalInstance) {

    $scope.ok = function() {

        $uibModalInstance.close();
    };

    $scope.cancel = function() {

        $uibModalInstance.dismiss('cancel');
    };
}

export default IndexingModalDeletePlayController;
