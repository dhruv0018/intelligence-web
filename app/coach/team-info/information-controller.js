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
    '$rootScope', '$scope', '$state', '$http', 'config', 'GamesFactory', 'PlayersFactory', 'Coach.Data',
    function controller($rootScope, $scope, $state, $http, config, games, players, data) {
        var reader = new FileReader();

        data.then(function(data) {
            $scope.data = data;
        });

        $scope.upload = function(files) {
            reader.readAsDataURL(files[0]);

            reader.onload = function() {
                $scope.data.coachTeam.imageUrl = reader.result;
                $scope.$apply();
            };

            var url = config.api.uri + 'teams/' + $scope.data.coachTeam.id + '/image/file';

            var data = new FormData();

            data.append('imageFile', files[0]);

            $http.post(url, data, {
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
            })
            .success(function(team) {
                data.coachTeam = $scope.data.coachTeam = team;
            })
            .error(function() {
                console.log('the image upload failed');
            });
        };
    }
]);


