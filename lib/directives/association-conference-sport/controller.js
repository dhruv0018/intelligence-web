AssociationConferenceSportController.$inject = [
    '$scope',
    'ConferencesFactory',
    'SportsFactory'
];

function AssociationConferenceSportController (
    $scope,
    conferences,
    sports
) {
    $scope.sports = sports.getMap();
    $scope.toggleDefunct = function() {
        $scope.conferenceSport.isDefunct = !$scope.conferenceSport.isDefunct;
        conferences.updateConferenceSports($scope.conferenceSport);
    };

    $scope.deleteConferenceSport = function() {
        conferences.deleteConferenceSports($scope.conferenceSport).then(() => {
            $scope.$emit('delete-conference-sport');
        });
    };
}

export default AssociationConferenceSportController;
