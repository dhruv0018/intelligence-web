/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FilmHome page module.
 * @module FilmHome
 */
var FilmHome = angular.module('Coach.FilmHome');

/**
 * FilmHome controller.
 * @module FilmHome
 * @name FilmHome.controller
 * @type {controller}
 */
FilmHome.controller('Coach.FilmHome.controller', [
    '$rootScope', '$scope', '$state', '$filter', 'GamesFactory', 'PlayersFactory', 'TeamsFactory', 'SessionService', 'Coach.Data', 'ROLES',
    function controller($rootScope, $scope, $state, $filter, games, players, teams, session, data, ROLES) {
        var teamId = session.currentUser.currentRole.teamId;
        $scope.playersList = data.playersList;
        $scope.games = games.getCollection();
        $scope.gamesList = games.getList();
        $scope.teams = teams.getCollection();
        $scope.team = teams.get(teamId);
        $scope.roster = $scope.team.roster;
        $scope.activeRoster = players.constructActiveRoster($scope.playersList, $scope.roster.id);
        $scope.query = '';
        $scope.data = data;
        $scope.ROLES = ROLES;
        $scope.headCoach = data.headCoach;
    }
]);

