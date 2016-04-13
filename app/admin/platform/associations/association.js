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
    $scope.regions = [];

    if (associationId) {

        $scope.association = associations.get(associationId);
    }

    $scope.association = $scope.association || associations.create({
        competitionLevels: [],
        isSanctioning: false,
        isDefunct: false
    });

    $scope.updateRegionList = function() {
        if ($scope.association.country) {
            iso3166countries.getRegions($scope.association.country).then((regionData) => {
                $scope.regions = regionData;
            });
        }
    };

    $scope.addCompetitionLevel = function(newCompetitionLevel) {
        if (newCompetitionLevel) {
            $scope.association.competitionLevels.push(newCompetitionLevel);
            $scope.newCompetitionLevel = '';
        }
    };

    $scope.removeCompetitionLevel = function(index) {
        $scope.association.competitionLevels.splice(index, 1);
    };

    $scope.addConference = function() {

    };
}

export default AssociationController;
