/* Fetch angular from the browser scope */
const angular = window.angular;

AthleteFilmHomeController.$inject = [
    '$scope',
    'SessionService',
    'TeamsFactory',
    'GamesFactory',
    'PlayersFactory',
    'UsersFactory',
    'Athlete.FilmHome.Data',
    'ReelsFactory'
];

/**
 * FilmHome controller.
 * @module FilmHome
 * @name AthleteFilmHomeController
 * @type {controller}
 */

function AthleteFilmHomeController($scope, session, teams, games, players, users, data, reels) {

    let teamId = session.currentUser.currentRole.teamId;

    $scope.team = teams.get(teamId);
    $scope.teams = teams.getCollection();
    $scope.games = games.getCollection();
    $scope.reels = reels.getCollection();
    let gamesList = games.getByRelatedRole();
    let reelsList = reels.getByRelatedRole();
    $scope.filmsList = gamesList.concat(reelsList);
    $scope.query = '';
    $scope.currentUser = session.getCurrentUser();

    //ui
    $scope.filteredFilmsList = $scope.filmsList;
}

export default AthleteFilmHomeController;
