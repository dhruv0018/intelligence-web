/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * TeamInfo page module.
 * @module FilmHome
 */
var TeamInfo = angular.module('Coach.Team.Info');




/**
 * User controller. Controls the view for adding and editing a single user.
 * @module TeamInfo
 * @name FilmInfo.controller
 * @type {controller}
 */
TeamInfo.controller('Coach.TeamInfo.controller', [
    '$rootScope', '$scope', '$state', 'GamesFactory', 'PlayersFactory', 'Coach.Data',
    function controller($rootScope, $scope, $state, games, players, data) {
        console.log('Inside the team info controller');
    }
]);


