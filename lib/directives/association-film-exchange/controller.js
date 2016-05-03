AssociationFilmExchangeController.$inject = [
    '$scope',
    '$filter',
    'ConferencesFactory',
    'SportsFactory',
    'BasicModals',
    'AlertsService'
];

function AssociationFilmExchangeController (
    $scope,
    $filter,
    conferences,
    sports,
    basicModals,
    alerts
) {
    $scope.sport = sports.getMap()[$scope.filmExchange.sportId];
    resetFilmExchangeInfo();

    $scope.onEditClick = function() {
        $scope.isEditingFilmExchange = true;
    };

    $scope.onSaveClick = function(updatedFilmExchangeName, updatedFilmExchangeIsVisibleToTeams) {
        updateFilmExchange(updatedFilmExchangeName, updatedFilmExchangeIsVisibleToTeams);
        $scope.isEditingFilmExchange = false;
    };

    $scope.onCancelClick = function() {
        $scope.isEditingFilmExchange = false;
        resetFilmExchangeInfo();
    };

    $scope.onDeleteClick = function() {
        removeFilmExchange();
    };

    function updateFilmExchange(updatedFilmExchangeName, updatedFilmExchangeIsVisibleToTeams) {
        $scope.filmExchange.name = updatedFilmExchangeName;
        $scope.filmExchange.isVisibleToTeams = updatedFilmExchangeIsVisibleToTeams;
        conferences.updateFilmExchange($scope.filmExchange);
        $scope.isEditingConference = false;
    }

    function removeFilmExchange() {
        let deleteFilmExchangeModal = basicModals.openForConfirm({
            title: 'Delete Film Exchange',
            bodyText: 'Are you sure you want to delete this film exchange?',
            buttonText: 'Yes'
        });

        deleteFilmExchangeModal.result.then(() => {
            conferences.deleteFilmExchange($scope.filmExchange).then(() => {
                $scope.$emit('delete-film-exchange');
                alerts.add({
                    type: 'success',
                    message: 'Film exchange deleted successfully!'
                });
            });
        });
    }

    function resetFilmExchangeInfo() {
        $scope.updatedFilmExchangeName = $scope.filmExchange.name;
        $scope.updatedFilmExchangeIsVisibleToTeams = $scope.filmExchange.isVisibleToTeams;
    }
}

export default AssociationFilmExchangeController;
