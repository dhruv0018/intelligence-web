/* Fetch angular from the browser scope */
var angular = window.angular;

CoachFilmHomeController.$inject = [
    '$rootScope',
    '$scope',
    '$state',
    '$filter',
    'ReelsFactory',
    'GamesFactory',
    'TeamsFactory',
    'UsersFactory',
    'LeaguesFactory',
    'PlayersFactory',
    'SessionService',
    'ROLES',
    'SPORTS'
];

/**
 * FilmHome controller.
 * @module FilmHome
 * @name FilmHome.controller
 * @type {controller}
 */
function CoachFilmHomeController(
    $rootScope,
    $scope,
    $state,
    $filter,
    reels,
    games,
    teams,
    users,
    leagues,
    players,
    session,
    ROLES,
    SPORTS
) {

    var currentUser = session.currentUser;
    var currentRole = currentUser.currentRole;
    var userId = currentUser.id;
    var teamId = currentRole.teamId;

    //Constants
    $scope.ROLES = ROLES;

    //team related
    $scope.team = teams.get(teamId);
    $scope.roster = $scope.team.roster;
    $scope.teamPlayers = $filter('toArray')($scope.roster.playerInfo);

    //league related
    let league = leagues.get($scope.team.leagueId);
    let season = league.getSeasonForWSC();
    if (season) $scope.seasonId = season.id;

    // Sport related
    let sport = $scope.team.getSport();
    $scope.isBasketball = sport.id === SPORTS.BASKETBALL.id;

    var gamesList = games.getByRelatedRole();
    var reelsList = reels.getByRelatedRole();

    $scope.filmsList = gamesList.concat(reelsList);

    //Collections of resources
    $scope.players =  players.getCollection();
    $scope.users = users.getCollection();
    $scope.teams = teams.getCollection();
    $scope.games = games.getCollection();
    $scope.reels = reels.getCollection();

    //Get film exchanges for current user
    $scope.filmExchanges = [];
    teams.getFilmExchanges(teamId).then(response => $scope.filmExchanges = response);

    //used for search
    $scope.query = '';

    //specific members of the team
    $scope.assistantCoaches = users.findByRole(ROLES.ASSISTANT_COACH, $scope.team);
    $scope.headCoach = users.findByRole(ROLES.HEAD_COACH, $scope.team)[0];

    //ui
    $scope.filteredFilmsList = $scope.filmsList;

    $scope.getPlayerJerseysAsNumbers = function(playerInfo) {
        return Number(playerInfo.jerseyNumber);
    };
}

export default CoachFilmHomeController;
