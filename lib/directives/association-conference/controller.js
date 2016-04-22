AssociationConferenceController.$inject = [
    '$scope',
    'ConferencesFactory',
    'SportsFactory'
];

function AssociationConferenceController (
    $scope,
    conferences,
    sports
) {
    $scope.isEditingConference = false;
    $scope.isAddingSport = false;
    $scope.updatedConferenceName = $scope.conference.name;
    $scope.updatedCompetitionLevel = $scope.conference.competitionLevel;
    $scope.newConferenceSport = {};
    $scope.conferenceSports = [];
    $scope.sports = sports.getList();

    updateConferenceSports();

    $scope.$on('delete-conference-sport', () => {
        updateConferenceSports();
    });

    $scope.getCompetitionLevelName = function(code){
        let result = 'None';
        angular.forEach($scope.competitionLevels, function(value){
            if(value.code === code){
                result =  value.name;
            }
        });
        return result;
    };

    $scope.updateConference = function($event, updatedConferenceName, updatedCompetitionLevel) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.conference.name = updatedConferenceName;
        $scope.conference.competitionLevel = updatedCompetitionLevel;
        conferences.updateConference($scope.conference);
        $scope.isEditingConference = false;
    };

    $scope.removeConference = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        conferences.deleteConference($scope.conference).then(() => {
            $scope.$emit('delete-conference');
        });
    };

    $scope.addConferenceSport = function(conferenceSport) {
        conferenceSport.conference = $scope.conference.code;
        conferenceSport.sportsAssociation = $scope.conference.sportsAssociation;
        conferenceSport.isDefunct = false;
        conferences.createConferenceSport(conferenceSport).then(() => {
            updateConferenceSports();
            $scope.newConferenceSport = {};
            $scope.isAddingSport = false;
        });
    };

    function updateConferenceSports() {
        conferences.loadConferenceSports($scope.conference.sportsAssociation, $scope.conference.code).then(response => {
            $scope.conferenceSports = response;
        });
    }
}

export default AssociationConferenceController;
