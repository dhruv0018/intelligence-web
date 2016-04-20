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
        updateCompetitionLevels();
        updateRegionList();
    }

    $scope.association = $scope.association || associations.create({
        isSanctioning: false,
        isDefunct: false
    });

    $scope.updateRegionList = updateRegionList;

    $scope.addCompetitionLevel = function(competitionLevel) {
        if (competitionLevel.name && competitionLevel.code) {
            competitionLevel.sortOrder = 1;
            competitionLevel.isDefunct = 0;
            competitionLevel.sportsAssociation = $scope.association.code;
            associations.createCompetitionLevel($scope.association.code, competitionLevel).then(() => {
                updateCompetitionLevels();
            });
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

    function updateCompetitionLevels() {
        associations.loadCompetitionLevels($scope.association.code).then(response => {
            $scope.competitionLevels = response;
        });
    }
}

export default AssociationController;
