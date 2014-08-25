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
    '$scope', 'SessionService', 'TeamsFactory', 'GamesFactory', 'PlayersFactory', 'Athlete.Data',
    function controller($scope, session, teams, games, players, data) {

        var teamId = session.currentUser.currentRole.teamId;

        $scope.playersList = data.playersList;
        $scope.games = games.getCollection();
        $scope.gamesList = games.getList();
        $scope.teams = teams.getCollection();
        $scope.team = teams.get(teamId);
        $scope.query = '';

        //TODO-- temp athlete -- remove this
//        $scope.tempAthlete = {
//            user: users.get(59),
//            players: [players.get(633)]
//        };
    }
]);

