/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Team page module.
 * @module Team
 */
var Team = angular.module('Coach.Team');

/**
 * Team controller.
 * @module Team
 * @name Team.controller
 * @type {controller}
 */
Team.controller('Coach.Team.Active.controller', [
    '$rootScope', '$scope', '$http', 'PlayersFactory', 'config', 'Coach.Data', 'AlertsService',
    function controller($rootScope, $scope, $http, players, config, data, alerts) {

    }
]);

