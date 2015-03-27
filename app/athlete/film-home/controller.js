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
    '$scope', 'SessionService', 'TeamsFactory', 'GamesFactory', 'PlayersFactory', 'UsersFactory', 'Athlete.FilmHome.Data', 'ReelsFactory',
    function controller($scope, session, teams, games, players, users, data, reels) {

        var teamId = session.currentUser.currentRole.teamId;

        $scope.playersList = data.playersList;
        $scope.team = teams.get(teamId);
        $scope.teams = teams.getCollection();
        $scope.games = games.getCollection();
        $scope.reels = reels.getCollection();
        var gamesList = games.getByRelatedRole();
        var reelsList = reels.getByRelatedRole();
        $scope.filmsList = gamesList.concat(reelsList);
        $scope.query = '';
        $scope.athlete = {
            user: users.get(session.currentUser.id),
            players: players.getList()
        };

        //ui
        $scope.filteredFilmsList = $scope.filmsList;
    }
]);
