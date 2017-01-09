const angular = window.angular;

/**
 * Athlete Info controller class
 * @class AthleteInfo
 */

AthleteInfoController.$inject = [
    '$scope',
    '$state',
    '$uibModalInstance',
    '$timeout',
    'GamesFactory',
    'UsersFactory',
    'PlayersFactory',
    'TeamsFactory',
    'AlertsService',
    'Athlete',
    'SessionService',
    'EMAIL_REQUEST_TYPES'
];

function AthleteInfoController (
    $scope,
    $state,
    $uibModalInstance,
    $timeout,
    games,
    users,
    players,
    teams,
    alerts,
    athlete,
    session,
    EMAIL_REQUEST_TYPES
) {
    $scope.keys = window.Object.keys;
    var reader = new FileReader();
    $scope.athlete = athlete;
    $scope.users = users.getCollection();
    $scope.user = (athlete.userId) ? users.get(athlete.userId) : users.create();

    var backup = angular.copy($scope.athlete);

    $scope.playerInfo = {
        jerseyNumber: '',
        positionIds: [],
        isActive: true
    };

    if ($scope.athlete.id && $scope.athlete.description === 'players') {

        $scope.playerInfo.jerseyNumber = $scope.team.roster.playerInfo[$scope.athlete.id].jerseyNumber;
        $scope.playerInfo.positionIds = $scope.team.roster.playerInfo[$scope.athlete.id].positionIds;
        $scope.playerInfo.isActive = $scope.team.roster.playerInfo[$scope.athlete.id].isActive;
    }

    $scope.savePlayer = function() {

        if ($scope.athleteForm.$valid  && $scope.athlete.description === 'players') {
            $scope.save($scope.athlete, $scope.user).then(function(athlete) {
                teams.fetch($scope.team.id).then(function(responseTeam) {
                    $scope.team.roles = responseTeam.roles;
                    $scope.team.roster.playerInfo[athlete.id] = $scope.playerInfo;
                    $scope.team.save().then(function() {
                        teams.fetch($scope.team.id).then(function(responseTeam) {
                            angular.extend($scope.team, responseTeam);
                        });
                    });
                });
            });
        } else {
            $scope.save($scope.athlete);
        }

        $uibModalInstance.close();
    };

    $scope.togglePlayer = function() {
        athlete.toggleActivation($scope.team);
        $scope.team.save();
        $uibModalInstance.close();
    };

    $scope.setProfileImage = function(files) {
        $scope.athlete.fileImage = files[0];

        reader.readAsDataURL(files[0]);

        reader.onload = function() {
            $scope.athlete.imageUrl = reader.result;
            $scope.$apply();
        };
    };

    $scope.resendInvite = function(userId, teamId) {
        $scope.sendingEmail = true;
        $scope.confirmSent = false;
        users.resendEmail(EMAIL_REQUEST_TYPES.PLAYER_ACTIVATION_REMINDER, {teamId: teamId}, userId);
        $timeout(function() {
            $scope.confirmSent = true;
        }, 1000);
        $timeout(function() {
            $scope.sendingEmail = false;
        }, 2500);
    };

    $uibModalInstance.result.catch(function() {
        angular.extend($scope.athlete, $scope.athlete, backup);
        if (!$scope.athlete.id && $scope.roster) {
            $scope.roster.pop();
        }
    });
}

export default AthleteInfoController;
