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
        var teamId = session.currentUser.currentRole.teamId;
        $scope.playersList = data.playersList;
        $scope.games = games.getCollection();
        $scope.gamesList = games.getList();
        $scope.reels = reels.getCollection();
        $scope.reelsList = reels.getList();
        $scope.filmsList = $scope.gamesList.concat($scope.reelsList);
        $scope.teams = teams.getCollection();
        $scope.team = teams.get(teamId);
        $scope.users = users.getCollection();
        $scope.roster = $scope.team.roster;
        $scope.activeRoster = players.constructActiveRoster($scope.playersList, $scope.roster.id);
        $scope.query = '';
        $scope.data = data;
        $scope.ROLES = ROLES;
        $scope.assistantCoaches = users.findByRole(ROLES.ASSISTANT_COACH, $scope.team);
        $scope.headCoach = users.findByRole(ROLES.HEAD_COACH, $scope.team)[0];
    }
]);

