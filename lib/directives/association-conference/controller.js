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
    $scope.status = {};

    updateConferenceSports();

    $scope.$on('delete-conference-sport', () => {
        updateConferenceSports();
    });

    if($scope.conference.code == $scope.newCode){
        $scope.status.open = true;
    }

    $scope.getCompetitionLevelName = function(code){
        let result = 'None';
        angular.forEach($scope.competitionLevels, function(value){
            if(value.code === code){
                result =  value.name;
            }
        });
        return result;
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

    $scope.onEditClick = function($event) {
        bypassAccordionToggle($event);
        $scope.isEditingConference = true;
    };

    $scope.onDeleteClick = function($event) {
        bypassAccordionToggle($event);
        removeConference();
    };

    $scope.onSaveClick = function($event, updatedConferenceName, updatedCompetitionLevel) {
        bypassAccordionToggle($event);
        updateConference(updatedConferenceName, updatedCompetitionLevel);
    };

    $scope.onCancelClick = function($event) {
        bypassAccordionToggle($event);
        $scope.isEditingConference = false;
    };

    $scope.onInputClick = function($event) {
        bypassAccordionToggle($event);
    };

    $scope.onAddSportClick = function() {
        $scope.isAddingSport = true;
    };

    $scope.onCancelAddingSportClick = function() {
        $scope.isAddingSport = false;
    };

    function updateConference(updatedConferenceName, updatedCompetitionLevel) {
        $scope.conference.name = updatedConferenceName;
        $scope.conference.competitionLevel = updatedCompetitionLevel;
        conferences.updateConference($scope.conference);
        $scope.isEditingConference = false;
    }

    function removeConference() {
        conferences.deleteConference($scope.conference).then(() => {
            $scope.$emit('delete-conference');
        });
    }

    function updateConferenceSports() {
        conferences.loadConferenceSports($scope.conference.sportsAssociation, $scope.conference.code).then(response => {
            $scope.conferenceSports = response;
        });
    }

    function bypassAccordionToggle($event) {
        $event.preventDefault();
        $event.stopPropagation();
    }
}

export default AssociationConferenceController;
