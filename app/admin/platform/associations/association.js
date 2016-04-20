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

    let associationId = Number($stateParams.id);
    $scope.countries = iso3166countries.getList();
    $scope.isExistingAssociation = false;
    $scope.regions = [];
    $scope.competitionLevels = [];

    if (associationId) {
        $scope.association = associations.get(associationId);
        $scope.isExistingAssociation = true;
        /*$scope.competitionLevels = associations.loadCompetitionLevels($scope.association.code).then(response => {
            return response.value;
        });
        console.log($scope.competitionLevels);*/
        updateRegionList();
    }

    $scope.association = $scope.association || associations.create({
        isSanctioning: false,
        isDefunct: false
    });

    $scope.updateRegionList = updateRegionList;

    $scope.addCompetitionLevel = function(competitionLevel) {
        if (newCompetitionLevel.name && newCompetitionLevel.code) {
            associations.createCompetitionLevel($scope.association.code, competitionLevel);
        }
    };

    $scope.removeCompetitionLevel = function(competitionLevel) {
        associations.deleteCompetitionLevel($scope.association.code, competitionLevel);
    };

    $scope.addConference = function() {

    };

    function updateRegionList() {
        if ($scope.association.country) {
            iso3166countries.getRegions($scope.association.country).then((regionData) => {
                $scope.regions = regionData;
            });
        }
    }
}

export default AssociationController;
