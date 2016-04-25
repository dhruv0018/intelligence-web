const angular = window.angular;
const moment = require('moment');

AssociationController.$inject = [
    '$scope',
    '$stateParams',
    '$state',
    'AssociationsFactory',
    'ConferencesFactory',
    'Iso3166countriesFactory',
    'BasicModals',
    'AlertsService'
];

/**
 * Associations page controller
 */
function AssociationController(
    $scope,
    $stateParams,
    $state,
    associations,
    conferences,
    iso3166countries,
    basicModals,
    alerts
) {

    let associationId = Number($stateParams.id);
    $scope.countries = iso3166countries.getList();
    $scope.isExistingAssociation = false;
    $scope.regions = [];
    $scope.competitionLevels = [];
    $scope.newCompetitionLevel = {};
    $scope.newConference = {};

    if (associationId) {
        $scope.association = associations.get(associationId);
        $scope.isExistingAssociation = true;
        updateCompetitionLevels();
        updateConferences();
        updateRegionList();
    }

    $scope.deleteAssocation = function(){
        if(associationId){
            let basicModalOptions = {};

            basicModalOptions.title = 'Are you sure to delete this association?';
            basicModals.openForConfirm(basicModalOptions).result.then(
                function(){
                    associations.delete($scope.association)
                        .then(function(){
                            //go to the association main page
                            $state.go('associations');
                        })
                        .catch(function(response){
                            //stay at current page but alert the error
                            // alerts.add({
                            //     type: 'danger',
                            //     message: response
                            // });
                        });
                }
            );
        }
    };

    $scope.clickCheckBox = function(item){
        $scope[item] = !$scope[item];
        $scope.form.$setDirty();
        console.log($scope[item]);
    };

    $scope.$watch('association.isSanctioning', function(n, o){
        if(n !== o){
            $scope.form.$setDirty();
        }
    });

    $scope.$watch('association.isDefunct', function(n, o){
        if(n !== o){
            $scope.form.$setDirty();
        }
    });

    $scope.association = $scope.association || associations.create({
        isSanctioning: false,
        isDefunct: false
    });

    $scope.$on('delete-competition-level', () => {
        updateCompetitionLevels();
    });

    $scope.$on('delete-conference', () => {
        updateConferences();
    });

    $scope.updateRegionList = updateRegionList;

    $scope.addCompetitionLevel = function(competitionLevel) {
        if (competitionLevel.name && competitionLevel.code) {
            competitionLevel.sortOrder = 1;
            competitionLevel.isDefunct = 0;
            competitionLevel.sportsAssociation = $scope.association.code;
            associations.createCompetitionLevel($scope.association.code, competitionLevel).then(() => {
                updateCompetitionLevels();
                $scope.newCompetitionLevel = {};
                $scope.form.$setPristine();
            });
        }
    };

    $scope.addConference = function(newConference) {
        if (newConference.name && newConference.code) {
            let conference = conferences.create({
                name: newConference.name,
                code: newConference.code,
                competitionLevel: newConference.competitionLevel || null,
                sortOrder: 1,
                isDefunct: 0,
                sportsAssociation: $scope.association.code
            });
            conferences.createConference($scope.association.code, conference).then(() => {
                updateConferences();
                $scope.newConference = {};
                $scope.form.$setPristine();
            });
        }
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

    function updateConferences() {
        conferences.loadConferences($scope.association.code).then(response => {
            $scope.conferences = response.sort((a, b) => moment(b.createdAt).diff(a.createdAt));
        });
    }
}

export default AssociationController;
