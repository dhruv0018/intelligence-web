AssociationCompetitionLevelController.$inject = [
    '$scope',
    'AssociationsFactory',
    'BasicModals',
    'AlertsService'
];

function AssociationCompetitionLevelController (
    $scope,
    associations,
    basicModals,
    alerts
) {
    resetCompLevelInfo();

    $scope.onCancelClick = function() {
        resetCompLevelInfo();
    };

    $scope.updateCompetitionLevel = function(updatedCompetitionLevelName) {
        $scope.competitionLevel.name = updatedCompetitionLevelName;
        associations.updateCompetitionLevel($scope.competitionLevel).then(response => {
            $scope.isEditingCompetitionLevel = false;
            alerts.add({
                type: 'success',
                message: 'Competition level updated successfully!'
            });
        });
    };

    $scope.removeCompetitionLevel = function() {
        let deleteCompLevelModal = basicModals.openForConfirm({
            title: 'Delete Competition Level',
            bodyText: 'Are you sure you want to delete this competition level?',
            buttonText: 'Yes'
        });

        deleteCompLevelModal.result.then(() => {
            associations.deleteCompetitionLevel($scope.competitionLevel).then(() => {
                $scope.$emit('delete-competition-level');
                alerts.add({
                    type: 'success',
                    message: 'Competition level deleted successfully!'
                });
            });
        });
    };

    function resetCompLevelInfo() {
        $scope.isEditingCompetitionLevel = false;
        $scope.updatedCompetitionLevelName = $scope.competitionLevel.name;
    }
}

export default AssociationCompetitionLevelController;
