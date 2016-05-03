AssociationConferenceController.$inject = [
    '$scope',
    'ConferencesFactory',
    'SportsFactory',
    'BasicModals',
    'AlertsService'
];

function AssociationConferenceController (
    $scope,
    conferences,
    sports,
    basicModals,
    alerts
) {
    $scope.isEditingConference = false;
    $scope.isAddingSport = false;
    $scope.newConferenceSport = {};
    $scope.conferenceSports = [];
    $scope.sports = sports.getList();
    $scope.status = {};

    resetConferenceInfo();
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
            $scope.$emit('added-conference-sport');
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
        resetConferenceInfo();
    };

    $scope.onInputClick = function($event) {
        bypassAccordionToggle($event);
    };

    $scope.onAddSportClick = function() {
        $scope.isAddingSport = true;
    };

    $scope.onCancelAddingSportClick = function() {
        $scope.isAddingSport = false;
        $scope.newConferenceSport = {};
    };

    function updateConference(updatedConferenceName, updatedCompetitionLevel) {
        $scope.conference.name = updatedConferenceName;
        $scope.conference.competitionLevel = updatedCompetitionLevel;
        conferences.updateConference($scope.conference);
        $scope.isEditingConference = false;
    }

    function removeConference() {
        let deleteConferenceModal = basicModals.openForConfirm({
            title: 'Delete Conference',
            bodyText: 'Are you sure you want to delete this conference?',
            buttonText: 'Yes'
        });

        deleteConferenceModal.result.then(() => {
            conferences.deleteConference($scope.conference).then(() => {
                $scope.$emit('delete-conference');
                alerts.add({
                    type: 'success',
                    message: 'Conference deleted successfully!'
                });
            });
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

    function resetConferenceInfo() {
        $scope.updatedConferenceName = $scope.conference.name;
        $scope.updatedCompetitionLevel = $scope.conference.competitionLevel;
    }
}

export default AssociationConferenceController;
