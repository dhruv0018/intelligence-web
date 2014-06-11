/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Users page module.
 * @module Users
 */
var Users = angular.module('Users');

/**
 * Users controller. Controls the view for displaying multiple users.
 * @module Users
 * @name Users.Controller
 * @type {Controller}
 */
Users.controller('Users.Users.Controller', [
    '$rootScope', '$scope', '$state', '$modal', '$stateParams', 'SessionService', 'ROLES', 'Users.User.Service', 'UsersFactory', 'TeamsFactory', 'LeaguesFactory', 'SportsFactory',
    function controller($rootScope, $scope, $state, $modal, $stateParams, session, ROLES, user, users, teams, leagues, sports) {

        $scope.ROLES = ROLES;
        $scope.HEAD_COACH = ROLES.HEAD_COACH;
        $scope.ASSISTANT_COACH = ROLES.ASSISTANT_COACH;
        $scope.ATHLETE = ROLES.ATHLETE;
        $scope.Users = users;
        $scope.statuses = [{value: 0, label: 'Active'}, {value: 1, label: 'Inactive'}];

        sports.getList(function(sports) { $scope.sports = sports; }, null, true);
        leagues.getList(function(leagues) { $scope.leagues = leagues; }, null, true);
        teams.getList(function(teams) { $scope.teams = teams; }, null, true);

        $scope.add = function() {

            $modal.open({

                templateUrl: 'users/adduser.html',
                controller: 'Users.User.Controller'

            }).result.then(function() {

                $state.go('user-info');
            });
        };

        $scope.search = function(filter) {

            $scope.users = users.getList(filter);
        };
    }
]);

