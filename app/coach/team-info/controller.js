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

TeamInfo.controller('Coach.Team.Info.controller', [
    '$rootScope',
    '$scope',
    '$state',
    '$http',
    'config',
    'GamesFactory',
    'PlayersFactory',
    function controller(
        $rootScope,
        $scope,
        $state,
        $http,
        config,
        games,
        players
    ) {

        $state.go('Coach.Team.Info.Information');
    }
]);

TeamInfo.controller('Coach.Team.Plans.controller', [
    '$rootScope',
    '$scope',
    '$state',
    '$http',
    'config',
    'SessionService',
    'TeamsFactory',
    'GamesFactory',
    'PlayersFactory',
    function controller(
        $rootScope,
        $scope,
        $state,
        $http,
        config,
        session,
        teams,
        games,
        players
    ) {

        var teamId = session.currentUser.currentRole.teamId;
        var team = teams.get(teamId);

        $scope.activePlan = team.getActivePlan();
        $scope.activePackage = team.getActivePackage();
    }
]);
