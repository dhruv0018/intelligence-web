AssociationConferenceController.$inject = [
    '$scope',
    'ConferencesFactory'
];

function AssociationConferenceController (
    $scope,
    conferences
) {
    $scope.isEditingConference = false;
    $scope.updatedConferenceName = $scope.conference.name;
    $scope.updatedCompetitionLevel = $scope.conference.competitionLevel;

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
}

export default AssociationConferenceController;
