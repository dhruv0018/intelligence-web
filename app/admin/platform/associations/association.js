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
    $scope.regions = [];
    $scope.competitionLevels = [];

    if (associationId) {
        $scope.association = associations.get(associationId);
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

    $scope.addCompetitionLevel = function(newCompetitionLevel) {
        if (newCompetitionLevel.name && newCompetitionLevel.code) {
            $scope.competitionLevels.push(newCompetitionLevel);
            $scope.newCompetitionLevel = {};
        }
    };

    $scope.removeCompetitionLevel = function(index) {
        $scope.competitionLevels.splice(index, 1);
    };

    $scope.addConference = function() {

    };

    $scope.saveAssociation = function() {
        $scope.association.save().then(response => {
            if ($scope.competitionLevels.length) {
                associations.createCompetitionLevel(response.code, $scope.competitionLevels);
            }
        });
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
