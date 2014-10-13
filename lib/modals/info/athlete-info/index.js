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
    '$scope', '$state', '$modalInstance', '$timeout', 'GamesFactory', 'UsersFactory', 'PlayersFactory', 'TeamsFactory', 'AlertsService', 'Athlete', 'ResourceManager', 'SessionService',
    function controller($scope, $state, $modalInstance, $timeout, games, users, players, teams, alerts, athlete, resourceManager, session) {
        $scope.keys = window.Object.keys;
        var reader = new FileReader();
        $scope.athlete = athlete;
        $scope.users = users.getCollection();
        console.log($scope.team);
        console.log($scope.athlete);
        console.log($scope);
        var backup = angular.copy($scope.athlete);

        //TODO truely horrid
        if (!$scope.athlete.id) {
            //because there is no player id at this point, but we need a way to fill in the jersey number model
            //we have to make a temporary hash into the team to store the jersey numbers which is then later retrieved
            //when the player is actually saved
            $scope.athlete.id = -1;
            $scope.team.roster.playerInfo[-1] = {
                positionIds: []
            };
        }

        $scope.cancel = function() {

            if (!$scope.athlete.id) {
                $scope.toggleActivation($scope.player);
            }

            $modalInstance.close();
        };

        $scope.savePlayer = function() {
            //TODO awful awful awful, AWFUL
            if (athlete.id === -1) {
                delete athlete.id;
            }

            if ($scope.athleteForm.$valid) {
                $scope.save($scope.athlete).then(function(athlete) {
                    console.log(athlete);
                    console.log($scope.team);

                    if ($scope.team.roster.playerInfo[-1]) {
                        //if there is something stored at the temporary hash then it is for a player whose id you did not have at the time
                        //retrieve that data and rehash it using the new player id then delete the temporary value
                        $scope.team.roster.playerInfo[athlete.id] = ($scope.team.roster.playerInfo[athlete.id]) ? $scope.team.roster.playerInfo[athlete.id] : $scope.team.roster.playerInfo[-1];
                        delete $scope.team.roster.playerInfo[-1];
                    }

                    $scope.team.roster.playerInfo[athlete.id].isActive = true;

                    $scope.team.save();
                });
                $modalInstance.close();
            }
        };

        $scope.togglePlayer = function() {
            $scope.toggleActivation($scope.athlete);
            $scope.save($scope.athlete);
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


