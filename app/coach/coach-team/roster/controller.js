/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Team page module.
 * @module Team
 */
var TeamRoster = angular.module('coach-team-roster');

/**
 * TeamRoster controller.
 * @module Team
 * @name Team.controller
 * @type {controller}
 */

TeamRoster.controller('Coach.Team.Roster.controller', [
    '$q', '$rootScope', '$scope', '$state', '$stateParams', '$filter', 'AlertsService', 'config', 'ROLES', 'LeaguesFactory', 'PositionsetsFactory', 'TeamsFactory', 'PlayersFactory', 'UsersFactory', 'SessionService',
    function controller($q, $rootScope, $scope, $state, $stateParams, $filter, alerts, config, ROLES, leagues, positionsets, teams, players, users, session) {
        $scope.ROLES = ROLES;
        $scope.HEAD_COACH = ROLES.HEAD_COACH;
        $scope.config = config;
        $scope.playersFactory = players;
        $scope.usersFactory = users;

        //toggles between player views
        $scope.filtering = [
            {type: 'active'},
            {type: 'inactive'}
        ];

        //Collections
        $scope.teams = teams.getCollection();
        $scope.leagues = leagues.getCollection();
        $scope.users = users.getCollection();

        //Team
        $scope.team = teams.get(session.currentUser.currentRole.teamId);

        //League
        $scope.league = leagues.get($scope.team.leagueId);

        //Positions
        $scope.positionset = positionsets.get($scope.league.positionSetId);
        $scope.positions = $scope.positionset.indexedPositions;

        //Roster
        //TODO honestly, this should be renamed, the roster is a specific thing and NOT a array of players
        var playersFilter = { rosterId: $scope.team.roster.id };
        $scope.roster = players.getList(playersFilter);

        /* We want to check all the players that do not exist in the users collections
         * and load them.
         */
        let userIds = [];
        $scope.roster.forEach((player) => {
            if(player.userId) {
                /* Since doing a get on an nonexisting user id will cause an error and
                * stop executing the foreach, adding the try catch is necessary to load the missing
                * user object(s)
                */
                try {
                    users.get(player.userId);
                } catch(err) {
                    userIds.push(player.userId);
                }
            }
        });

        if (userIds.length){
            users.load(userIds);
        }

        $scope.rosterId = $scope.team.roster.id;

        alerts.add({
            type: 'warning',
            message: 'All game film is automatically shared with Athletes on your active roster.'
        });
    }
]);
