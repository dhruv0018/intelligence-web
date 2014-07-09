/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * TeamInfo page module.
 * @module FilmHome
 */
var TeamInfo = angular.module('Coach.Team.Info');

/**
 * Team Info Information controller
 * @module Coach.Team.Info
 * @name Information
 * @type {controller}
 */
TeamInfo.controller('Coach.Team.Info.Information.controller', [
    '$rootScope', '$scope', '$state', '$http', 'config', 'GamesFactory', 'PlayersFactory', 'Coach.Data', 'SessionService',
    function controller($rootScope, $scope, $state, $http, config, games, players, data, session) {
        var reader = new FileReader();
        $scope.data = data;

        //Team
        $scope.team = $scope.data.teams.getCollection()[session.currentUser.currentRole.teamId];

        $scope.setLogo = function(files) {
            $scope.logo = files[0];

            reader.readAsDataURL(files[0]);

            reader.onload = function() {
                $scope.team.imageUrl = reader.result;
                $scope.$apply();
            };
        };

        $scope.save = function() {
            var data = new FormData();
            data.append('imageFile', $scope.logo);

            var url = config.api.uri + 'teams/' + $scope.team.id + '/image/file';

            $http.post(url, data, {
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
            })
            .success(function(team) {
                $scope.data.teams.getCollection()[session.currentUser.currentRole.teamId] = team;
            })
            .error(function() {
                console.log('the image upload failed');
            });
        };
    }

]);


