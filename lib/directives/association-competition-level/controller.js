AssociationCompetitionLevelController.$inject = [
    '$scope',
    'AssociationsFactory'
];

function AssociationCompetitionLevelController (
    $scope,
    associations
) {
    $scope.isEditingCompetitionLevel = false;
    $scope.updatedCompetitionLevelName = $scope.competitionLevel.name;

    $scope.updateCompetitionLevel = function(updatedCompetitionLevelName) {
        $scope.competitionLevel.name = updatedCompetitionLevelName;
        associations.updateCompetitionLevel($scope.competitionLevel);
        $scope.isEditingCompetitionLevel = false;
    };

    $scope.removeCompetitionLevel = function() {
        associations.deleteCompetitionLevel($scope.competitionLevel).then(() => {
            $scope.$emit('delete-competition-level');
        });
    };
}

export default AssociationCompetitionLevelController;
