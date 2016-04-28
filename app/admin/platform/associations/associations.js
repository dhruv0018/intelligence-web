const angular = window.angular;

AssociationsController.$inject = [
    '$scope',
    '$state',
    'AssociationsFactory'
];

/**
 * Associations page controller
 */
function AssociationsController(
    $scope,
    $state,
    associations
) {

    $scope.associations = associations.query().then(filteredAssociations => {

        $scope.associations = filteredAssociations;

    }).catch(function(){
        $scope.associations = [];
    });

    $scope.add = function() {
        $state.go('association-info');
    };

    $scope.search = function(filter) {

        $scope.searching = true;
        $scope.associations.length = 0;

        $scope.query = associations.query(filter).then(filteredAssociations => {

            $scope.associations = filteredAssociations;

        }).finally(function() {

            $scope.searching = false;
        });
    };
}

export default AssociationsController;
