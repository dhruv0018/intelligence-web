const angular = window.angular;

AssociationController.$inject = [
    '$scope',
    '$stateParams',
    'AssociationsFactory',
    'Iso3166countriesFactory'
];

/**
 * Associations page controller
 */
function AssociationController(
    $scope,
    $stateParams,
    associations,
    iso3166countries
) {

    let associationId = $stateParams.id;
    $scope.countries = iso3166countries.getList();

    if (associationId) {

        $scope.association = associations.get(associationId);
    }

    $scope.association = $scope.association || associations.create({});

    $scope.addCompetitionLevel = function() {

    };

    $scope.addConference = function() {

    };
}

export default AssociationController;
