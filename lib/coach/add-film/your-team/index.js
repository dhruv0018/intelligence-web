/* Component settings */
var templateUrl = 'coach/uploading-film/your-team.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Your Team page module.
 * @module YourTeam
 */
var YourTeam = angular.module('your-team', []);

/* Cache the template file */
YourTeam.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Your Team page state router.
 * @module YourTeam
 * @type {UI-Router}
 */
YourTeam.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('your-team', {
                url: '',
                parent: 'uploading-film',
                views: {
                    'your-team@uploading-film': {
                        templateUrl: templateUrl,
                        controller: 'YourTeamController'
                    }
                }
            });
    }
]);

/**
 * YourTeam controller.
 * @module YourTeam
 * @name YourTeamController
 * @type {Controller}
 */
YourTeam.controller('YourTeamController', [
    '$scope', '$state', '$localStorage', 'UploadingFilmTabs', 'PlayersFactory',
    function controller($scope, $state, $localStorage, tabs, players) {

        $scope.$storage = $localStorage;

        /* FIXME: Remove, this is just temp. */
        $scope.players = [

            {
                firstName: 'Thomas',
                lastName: 'Anderson',
                jerseyNumbers: {},
                position: 'SG',
                played: true
            },
            {
                firstName: 'Thomas',
                lastName: 'Anderson',
                jerseyNumbers: {},
                position: 'SG',
                played: true
            },
            {
                firstName: 'Thomas',
                lastName: 'Anderson',
                jerseyNumbers: {},
                position: 'SG',
                played: true
            },
            {
                firstName: 'Thomas',
                lastName: 'Anderson',
                jerseyNumbers: {},
                position: 'SG',
                played: true
            }
        ];
        $scope.players[0].jerseyNumbers[$scope.$storage.game.teamId] = '24';
        $scope.players[1].jerseyNumbers[$scope.$storage.game.teamId] = '24';
        $scope.players[2].jerseyNumbers[$scope.$storage.game.teamId] = '24';
        $scope.players[3].jerseyNumbers[$scope.$storage.game.teamId] = '24';
        console.dir($scope.players);

        $scope.$watch('formYourTeam.$invalid', function(invalid) {

            tabs['opposing-team'].disabled = invalid;
        });

        $scope.save = function() {

            var teamId = $scope.$storage.game.teamId;
            var rosters = $scope.$storage.game.rosters;

            /* Match the team roster. */
            var roster = rosters.filter(function(roster) {

                return roster.teamId === teamId;

            }).pop();

            /* Filter out players which are marked as did not play. */
            var playedPlayers = $scope.players.filter(function(player) {

                return player.played;

            }).map(function(player) {

                player.rosterIds = player.rosterIds || [];
                player.rosterIds.push(roster.id);
                return player;
            });

            players.save(playedPlayers);
            tabs['your-team'].active = false;
            tabs['opposing-team'].active = true;
            $state.go('opposing-team');
        };
    }
]);

