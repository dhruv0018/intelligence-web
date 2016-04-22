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

    $scope.updateConference = function(updatedConferenceName, updatedCompetitionLevel) {
        $scope.conference.name = updatedConferenceName;
        $scope.conference.competitionLevel = updatedCompetitionLevel;
        conferences.updateConference($scope.conference);
        $scope.isEditingConference = false;
    };

    $scope.removeConference = function() {
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
