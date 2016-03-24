const angular = window.angular;

AssociationController.$inject = [
    '$scope',
    '$stateParams',
    'AssociationsFactory'
];

/**
 * Associations page controller
 */
function AssociationController(
    $scope,
    $stateParams,
    associations
) {

    let associationId = Number($stateParams.id);

        if (associationId) {

            $scope.association = associations.get(associationId);
        }

        $scope.association = $scope.association || associations.create();
}

export default AssociationController;
