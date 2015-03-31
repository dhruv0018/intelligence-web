/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * EditProfile.BasicInfo page module.
 * @module EditProfile.BasicInfo
 */
var BasicInfo = angular.module('Athlete.EditProfile.BasicInfo');

/**
 * EditProfile.BasicInfo controller.
 * @module EditProfile.BasicInfo
 * @name EditProfile.BasicInfo.controller
 * @type {controller}
 */
BasicInfo.controller('Athlete.EditProfile.BasicInfo.controller', [
    '$scope', '$http', 'config', 'TeamsFactory', 'LeaguesFactory', 'SportsFactory', 'PositionsetsFactory', 'UsersFactory', 'SessionService', 'AlertsService', 'Athlete.EditProfile.Data',
    function controller($scope, $http, config, teams, leagues, sports, positionsets, users, session, alerts, data) {
        $scope.athlete = session.getCurrentUser();
        $scope.teams = teams.getMap();
        $scope.addingTeam = false;

        $scope.removeTeam = function removeTeam(teamId) {
            let profileTeams = $scope.athlete.profile.teams;

            profileTeams.forEach((team, index, teams) => {
                if (team.teamId === teamId) {
                    teams.splice(index, 1);
                }
            });
        };

        $scope.getPositionSet = function getPositionSet(teamId) {
            let team = teams.get(teamId);
            let league = leagues.get(team.leagueId);
            let positionset = positionsets.get(league.positionSetId);
            return positionset;
        };

        $scope.getTeamSportName = function getTeamSportName(teamId) {
            let team = teams.get(teamId);
            let league = leagues.get(team.leagueId);
            let sport = sports.get(league.sportId);
            return sport.name;
        };

        $scope.saveBasicInfo = function saveBasicInfo() {
            if ($scope.athlete.fileImage) {
                let data = new FormData();
                data.append('imageFile', $scope.athlete.fileImage);

                $http.post(config.api.uri + 'users/' + $scope.athlete.id + '/image/file', data, {
                    headers: { 'Content-Type': undefined },
                    transformRequest: angular.identity
                })
                    .success(function(responseUser) {
                        $scope.athlete.imageUrl = responseUser.imageUrl;
                        $scope.athlete.save().then(function() {
                            alerts.add({
                                type: 'success',
                                message: 'Your profile has been saved.'
                            });
                        });
                        delete $scope.athlete.fileImage;
                    })
                    .error(function() {
                        delete $scope.athlete.imageUrl;
                        alerts.add({
                            type: 'danger',
                            message: 'The image upload failed.'
                        });
                    });
            } else {
                $scope.athlete.save().then(function() {
                    alerts.add({
                        type: 'success',
                        message: 'Your profile has been saved.'
                    });
                });
            }
        };
    }
]);
