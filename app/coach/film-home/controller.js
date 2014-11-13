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
    '$rootScope', '$scope', '$state', '$filter', 'ReelsFactory', 'GamesFactory', 'PlayersFactory', 'TeamsFactory', 'UsersFactory', 'SessionService', 'Coach.Data', 'ROLES',
    function controller($rootScope, $scope, $state, $filter, reels, games, players, teams, users, session, data, ROLES) {

        var currentUser = session.currentUser;
        var currentRole = currentUser.currentRole;
        var userId = currentUser.id;
        var teamId = currentRole.teamId;

        //Constants
        $scope.ROLES = ROLES;

        //team related
        $scope.team = teams.get(teamId);
        $scope.roster = $scope.team.roster;

        //player related
        var playersFilter = { rosterId: $scope.team.roster.id };

        //Arrays of resources
        $scope.playersList = players.getList(playersFilter);

        $scope.gamesForTeam = games.getList({ uploaderTeamId: teamId });
        $scope.gamesSharedWithUser = games.getList({ sharedWithUserId: userId });
        $scope.gamesList = $scope.gamesForTeam.concat($scope.gamesSharedWithUser);
        $scope.reelsList = reels.getList();
        $scope.filmsList = $scope.gamesList.concat($scope.reelsList);

        //Collections of resources
        $scope.games = games.getCollection();
        $scope.reels = reels.getCollection();
        $scope.players = players.getCollection();
        $scope.teams = teams.getCollection();
        $scope.users = users.getCollection();

        //TODO not sure what this is used for -- potentially remove
        $scope.activeRoster = [];

        //used for search
        $scope.query = '';

        //specific members of the team
        $scope.assistantCoaches = users.findByRole(ROLES.ASSISTANT_COACH, $scope.team);
        $scope.headCoach = users.findByRole(ROLES.HEAD_COACH, $scope.team)[0];
    }
]);

