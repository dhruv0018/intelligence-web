/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * AthleteInfo page module.
 * @module AthleteInfo
 */
var AthleteInfo = angular.module('AthleteInfo', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
AthleteInfo.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('athlete-info.html', template);
    }
]);

/**
 * AthleteInfo Modal
 * @module AthleteInfo
 * @name AthleteInfo.Modal
 * @type {service}
 */
AthleteInfo.value('AthleteInfo.ModalOptions', {

    templateUrl: 'athlete-info.html',
    controller: 'AthleteInfo.controller'
});


/**
 * AthleteInfo modal dialog.
 * @module AthleteInfo
 * @name AthleteInfo.Modal
 * @type {service}
 */
AthleteInfo.service('AthleteInfo.Modal',[
    '$modal', 'AthleteInfo.ModalOptions',
    function($modal, modalOptions) {

        var Modal = {

            open: function(dataOptions) {

                var resolves = {
                    resolve: {
                        Athlete: function() {
                            return dataOptions.targetAthlete;
                        }
                    }
                };

                var options = angular.extend(modalOptions, resolves, dataOptions);
                return $modal.open(options);
            }
        };

        return Modal;
    }
]);

/**
 * AthleteInfo controller.
 * @module AthleteInfo
 * @name AthleteInfo.controller
 * @type {controller}
 */
AthleteInfo.controller('AthleteInfo.controller', [

    '$scope', '$state', '$modalInstance', '$timeout', 'GamesFactory', 'UsersFactory', 'TeamsFactory', 'PlayersFactory', 'AlertsService', 'Athlete', 'ResourceManager', 'SessionService',
    function controller($scope, $state, $modalInstance, $timeout, games, users, teams, players, alerts, athlete, resourceManager, session) {

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

        $scope.cancel = function() {

            if (!$scope.athlete.id) {
                $scope.toggleActivation($scope.player);
            }

            $modalInstance.close();
        };

        $scope.savePlayer = function() {

            if ($scope.athleteForm.$valid  && $scope.athlete.description === 'players') {
                $scope.save($scope.athlete, $scope.user).then(function(athlete) {

                    teams.fetch($scope.team.id).then(function(responseTeam) {
                        $scope.team.roles = responseTeam.roles;
                        $scope.team.roster.playerInfo[athlete.id] = $scope.playerInfo;
                        $scope.team.save();
                    });
                });
            } else {
                $scope.save($scope.athlete);
            }

            $modalInstance.close();
        };

        $scope.togglePlayer = function() {
            athlete.toggleActivation($scope.team);
            $scope.team.save();
            $modalInstance.close();
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
            players.resendEmail(userId, teamId);
            $timeout(function() {
                $scope.confirmSent = true;
            }, 1000);
            $timeout(function() {
                $scope.sendingEmail = false;
            }, 2500);
        };

        $modalInstance.result.catch(function() {
            angular.extend($scope.athlete, $scope.athlete, backup);
            if (!$scope.athlete.id && $scope.roster) {
                $scope.roster.pop();
            }
        });
    }
]);


