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
    '$rootScope', '$scope', '$state', 'GamesFactory', 'PlayersFactory', 'Coach.Data',
    function controller($rootScope, $scope, $state, games, players, data) {

    }
]);


