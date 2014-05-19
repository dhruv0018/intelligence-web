/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * TeamInfo page module.
 * @module FilmHome
 */
var TeamInfo = angular.module('Coach.TeamInfo');




/**
 * User controller. Controls the view for adding and editing a single user.
 * @module TeamInfo
 * @name FilmInfo.controller
 * @type {controller}
 */
TeamInfo.controller('Coach.TeamInfo.controller', [
    '$rootScope', '$scope', '$state', '$http', 'config', 'GamesFactory', 'PlayersFactory', 'Coach.Data',
    function controller($rootScope, $scope, $state, $http, config, games, players, data) {
        console.log($scope.$parent);

        data.then(function(data){
            $scope.data = data;
            console.log($scope.data);
        });

        $scope.upload = function(files){
            var url = config.api.uri + 'teams/' + $scope.data.coachTeam.id + '/image/file';
            var data = {ima};

            $http.post(url, data, options)

                .success(function(data) {
        };
    }
]);


