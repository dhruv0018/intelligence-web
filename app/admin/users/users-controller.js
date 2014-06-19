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
    '$rootScope', '$scope', '$state', '$modal', '$stateParams', 'SessionService', 'ROLES', 'Admin.Users.Data.Dependencies',
    function controller($rootScope, $scope, $state, $modal, $stateParams, session, ROLES, data) {

        $scope.ROLES = ROLES;
        $scope.HEAD_COACH = ROLES.HEAD_COACH;
        $scope.ASSISTANT_COACH = ROLES.ASSISTANT_COACH;
        $scope.ATHLETE = ROLES.ATHLETE;
        $scope.Users = users;
        $scope.statuses = [{value: 0, label: 'Active'}, {value: 1, label: 'Inactive'}];

        $scope.sports = data.sports.getCollection();
        $scope.leagues = data.leagues.getCollection();
        $scope.teams = data.teams.getCollection();

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

