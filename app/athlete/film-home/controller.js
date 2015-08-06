/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * FilmHome page module.
 * @module FilmHome
 */
const FilmHome = angular.module('Athlete.FilmHome');

/**
 * FilmHome controller.
 * @module FilmHome
 * @name FilmHome.controller
 * @type {controller}
 */
FilmHome.controller('Athlete.FilmHome.controller', [
    '$scope', 'SessionService', 'TeamsFactory', 'GamesFactory', 'PlayersFactory', 'UsersFactory', 'Athlete.FilmHome.Data', 'ReelsFactory',
    function controller($scope, session, teams, games, players, users, data, reels) {

        let teamId = session.currentUser.currentRole.teamId;

        $scope.playersList = data.playersList;
        $scope.team = teams.get(teamId);
        $scope.teams = teams.getCollection();
        $scope.games = games.getCollection();
        $scope.reels = reels.getCollection();
        let gamesList = games.getByRelatedRole();
        let reelsList = reels.getByRelatedRole();
        $scope.filmsList = gamesList.concat(reelsList);
        $scope.query = '';
        $scope.currentUser = session.getCurrentUser();
        $scope.userPlayers = players.getList();

        //ui
        $scope.filteredFilmsList = $scope.filmsList;
    }
]);
