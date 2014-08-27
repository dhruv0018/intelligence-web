/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FilmHome page module.
 * @module FilmHome
 */
var FilmHome = angular.module('Coach.FilmHome');




/**
 * User controller. Controls the view for adding and editing a single user.
 * @module FilmHome
 * @name FilmHome.controller
 * @type {controller}
 */
FilmHome.controller('Coach.FilmHome.controller', [
    '$rootScope', '$scope', '$state', '$filter', 'GamesFactory', 'PlayersFactory', 'SessionService', 'Coach.Data',
    function controller($rootScope, $scope, $state, $filter, games, players, session, data) {
        $scope.playersList = data.playersList;
        $scope.games = data.games.getCollection();
        $scope.gamesList = data.games.getList();
        $scope.teams = data.teams.getCollection();
        $scope.team = $scope.teams[session.currentUser.currentRole.teamId];
        $scope.roster = $scope.team.roster;
        $scope.activeRoster = players.constructActiveRoster($scope.playersList, $scope.roster.id);
        $scope.query = '';
    }
]);

