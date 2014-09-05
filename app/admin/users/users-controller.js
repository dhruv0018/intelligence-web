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
    '$rootScope', '$scope', '$state', '$modal', '$stateParams', 'SessionService', 'ROLES', 'Admin.Users.Data', 'SportsFactory', 'LeaguesFactory', 'TeamsFactory', 'UsersFactory',
    function controller($rootScope, $scope, $state, $modal, $stateParams, session, ROLES, data, sports, leagues, teams, users) {

        $scope.ROLES = ROLES;
        $scope.HEAD_COACH = ROLES.HEAD_COACH;
        $scope.ASSISTANT_COACH = ROLES.ASSISTANT_COACH;
        $scope.ATHLETE = ROLES.ATHLETE;

        $scope.users = [];

        $scope.Users = users;
        $scope.statuses = [{value: 0, label: 'Active'}, {value: 1, label: 'Inactive'}];

        $scope.sports = sports.getCollection();
        $scope.leagues = leagues.getCollection();
        $scope.teams = teams.getCollection();

        $scope.add = function() {

            $modal.open({

                templateUrl: 'users/adduser.html',
                controller: 'Users.User.New.Controller'
            });
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

        $scope.goToAs = function(user) {
            session.previousUser = angular.copy(session.currentUser);
            session.currentUser = user;
            $rootScope.currentUser = user;
            $state.go('Account.ContactInfo');
        };
    }
]);

