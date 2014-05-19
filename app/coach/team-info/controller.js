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

        data.then(function(data){
            $scope.data = data;
        });

        $scope.upload = function(files){
            var url = config.api.uri + 'teams/' + $scope.data.coachTeam.id + '/image/file';

            var data = new FormData();

            data.append('imageFile', files[0]);

            $http.post(url, data, {
                    headers: { 'Content-Type': undefined },
                    transformRequest: angular.identity
                })
                .success(function(imageData){
                    console.log(imageData);
                })
                .error(function() {
                    console.log('the image upload failed');
                });
        };
    }
]);


