/* Fetch angular from the browser scope */
var angular = window.angular;

IndexingModalDeletePlayController.$inject = [
    '$scope',
    '$modal',
    '$modalInstance'
];

/**
 * Modal controller. Controls the modal view.
 * @module Indexing
 * @name Modal.DeletePlay.Controller
 * @type {Controller}
 */
function IndexingModalDeletePlayController($scope, $modal, $modalInstance) {

    $scope.ok = function() {

        $modalInstance.close();
    };

    $scope.cancel = function() {

        $modalInstance.dismiss('cancel');
    };
}

export default IndexingModalDeletePlayController;
