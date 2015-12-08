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
    '$rootScope', '$scope', '$state', '$modal', '$stateParams', 'SessionService', 'AccountService', 'ROLES', 'Admin.Users.Data', 'SportsFactory', 'LeaguesFactory', 'TeamsFactory', 'UsersFactory',
    function controller($rootScope, $scope, $state, $modal, $stateParams, session, account, ROLES, data, sports, leagues, teams, users) {

        $scope.ROLES = ROLES;
        $scope.HEAD_COACH = ROLES.HEAD_COACH;
        $scope.ASSISTANT_COACH = ROLES.ASSISTANT_COACH;
        $scope.ATHLETE = ROLES.ATHLETE;

        $scope.account = account;

        $scope.users = [];

        $scope.Users = users;
        $scope.statuses = [{value: 0, label: 'Active'}, {value: 1, label: 'Inactive'}];

        $scope.sports = sports.getCollection();
        $scope.leagues = leagues.getCollection();
        $scope.teams = teams.getCollection();

        $scope.filter = {};

        $scope.add = function() {

            // $modal.open({
            //
            //     templateUrl: 'users/adduser.html',
            //     controller: 'Users.User.New.Controller'
            // });
            $state.go('user-info',{location: true});
        };

        $scope.search = function(filter) {

            $scope.searching = true;
            $scope.users.length = 0;

            $scope.query = users.search(filter).then(function(users) {

                $scope.users = users;

            }).finally(function() {

                $scope.searching = false;
            });
        };
    }
]);

Users.filter('rolesFilter', [
    'ROLE_ID', 'ROLE_TYPE', 'ROLES',
    function(ROLE_ID, ROLE_TYPE, ROLES) {
        return function(users, filter) {
            if (filter && !filter.role) {
                return users;
            }

            var role = ROLES[ROLE_ID[filter.role]];

            return users.filter(function(user) {
                return user.isActive(role);
            });

        };
    }]);
