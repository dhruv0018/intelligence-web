/* Fetch angular from the browser scope */
var angular = window.angular;

IndexingModalSendToTeamController.$inject = [
    '$scope',
    '$modalInstance'
];

/**
 * Modal controller. Controls the modal view.
 * @module Indexing
 * @name IndexingModalSendToTeamController
 * @type {Controller}
 */
function IndexingModalSendToTeamController($scope, $modalInstance) {

    $scope.yes = function() {

        $modalInstance.close();
    };

    $scope.no = function() {

        $modalInstance.dismiss('no');
    };
}

export default IndexingModalSendToTeamController;
