/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FilmHome page module.
 * @module FilmHome
 */
var FilmHome = angular.module('Athlete.FilmHome');

/**
 * FilmHome controller.
 * @module FilmHome
 * @name FilmHome.controller
 * @type {controller}
 */
FilmHome.controller('Athlete.FilmHome.controller', [
    '$scope', 'SessionService', 'TeamsFactory', 'GamesFactory', 'PlayersFactory', 'UsersFactory', 'Athlete.Data',
    function controller($scope, session, teams, games, players, users, data) {

        var teamId = session.currentUser.currentRole.teamId;

        $scope.playersList = data.playersList;
        $scope.games = games.getCollection();
        $scope.gamesList = games.getList();
        $scope.teams = teams.getCollection();
        $scope.team = teams.get(teamId);
        $scope.query = '';
        $scope.athlete = {
            user: users.get(session.currentUser.id),
            players: players.getList()
        };


        console.log($scope.athlete);
    }
]);

