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
        $scope.currentUser = session.currentUser;
        $scope.statuses = [{value: 0, label: 'Active'}, {value: 1, label: 'Not Active'}];

        $scope.teams = [];
        $scope.leagues = [];
        $scope.sports = [];

        $scope.Users = users;

        $scope.users = users.getList();

        teams.getList({}, function(teams){

            teams.forEach(function(team){

                $scope.teams[team.id] = team;
            });
        });

        leagues.getList({}, function(leagues){

            leagues.forEach(function(league){

                $scope.leagues[league.id] = league;
            });
        });

        sports.getList({}, function(sports){

            sports.forEach(function(sport){

                $scope.sports[sport.id] = sport;
            });
        });

        $scope.add = function() {

            $modal.open({

                templateUrl: 'users/adduser.html',
                controller: 'Users.User.Controller'

            }).result.then(function() {

                $state.go('user-info');
            });
        };

        $scope.search = function(filter) {
            users.getList(filter,
                function(users){
                    $scope.users = users;
                    $scope.noResults = false;
                },
                function(){
                    $scope.users = [];
                    $scope.noResults = true;
                }
            );
        };
    }
]);

