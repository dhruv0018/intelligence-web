AssociationConferenceSportController.$inject = [
    '$scope',
    '$filter',
    'ConferencesFactory',
    'SportsFactory',
    'BasicModals',
    'AlertsService'
];

function AssociationConferenceSportController (
    $scope,
    $filter,
    conferences,
    sports,
    basicModals,
    alerts
) {
    $scope.sports = sports.getMap();
    $scope.toggleDefunct = function() {
        $scope.conferenceSport.isDefunct = !$scope.conferenceSport.isDefunct;
        conferences.updateConferenceSports($scope.conferenceSport);
    };

    $scope.deleteConferenceSport = function() {
        let deleteConferenceSportModal = basicModals.openForConfirm({
            title: 'Delete Conference Sport',
            bodyText: 'Are you sure you want to delete this conference sport?',
            buttonText: 'Yes'
        });

        deleteConferenceSportModal.result.then(() => {
            conferences.deleteConferenceSports($scope.conferenceSport).then(() => {
                $scope.$emit('delete-conference-sport');
                alerts.add({
                    type: 'success',
                    message: 'Conference sport deleted successfully!'
                });
            });
        });
    };
}

export default AssociationConferenceSportController;
