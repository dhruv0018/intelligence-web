const angular = window.angular;

AssociationController.$inject = [
    '$scope',
    '$state',
    'AssociationsFactory'
];

/**
 * Associations page controller
 */
function controller(
    $scope,
    $state,
    associations
) {

    let associationId = Number($stateParams.id);

        if (schoolId) {

            $scope.association = associations.get(schoolId);
        }

        $scope.association = $scope.association || associations.create();
}

export default AssociationController;
