/* Fetch angular from the browser scope */
var angular = window.angular;

IndexingModalSendToTeamController.$inject = [
    '$scope',
    '$uibModalInstance'
];

/**
 * Modal controller. Controls the modal view.
 * @module Indexing
 * @name IndexingModalSendToTeamController
 * @type {Controller}
 */
function IndexingModalSendToTeamController($scope, $uibModalInstance) {

    $scope.yes = function() {

        $uibModalInstance.close();
    };

    $scope.no = function() {

        $uibModalInstance.dismiss('no');
    };
}

export default IndexingModalSendToTeamController;
