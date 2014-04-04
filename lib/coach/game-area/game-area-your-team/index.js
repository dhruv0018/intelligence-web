/* Component settings */
var templateUrl = 'coach/game-area-information/your-team.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Your Team page module.
 * @module YourTeam
 */
var GameAreaYourTeam = angular.module('game-area-your-team', []);

/* Cache the template file */
GameAreaYourTeam.run([
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
GameAreaYourTeam.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('ga-info-your-team', {
                url: '',
                parent: 'ga-info',
                views: {
                    'ga-info-your-team@ga-info': {
                        templateUrl: templateUrl,
                        controller: 'GameAreaYourTeamController'
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
GameAreaYourTeam.controller('GameAreaYourTeamController', [
    '$scope', '$state', '$localStorage', 'GameAreaTabs', 'PlayersFactory',
    function controller($scope, $state, $localStorage, tabs, players) {
        console.log('in your team ctrl');
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
        /* END TEMP */

        $scope.$storage.game.yourRoster = $scope.$storage.game.yourRoster ||
                                          $scope.$storage.game.getRoster($scope.$storage.game.teamId);

        $scope.rosterId = $scope.$storage.game.yourRoster.id;

        /* TEMP */
        $scope.players[0].jerseyNumbers[$scope.rosterId] = '24';
        $scope.players[1].jerseyNumbers[$scope.rosterId] = '24';
        $scope.players[2].jerseyNumbers[$scope.rosterId] = '24';
        $scope.players[3].jerseyNumbers[$scope.rosterId] = '24';
        console.dir($scope.players);
        /* END TEMP */

        $scope.$watch('formYourTeam.$invalid', function(invalid) {

            tabs['opposing-team'].disabled = invalid;
        });

        $scope.save = function() {
            players.save($scope.rosterId, $scope.players);
        };
    }
]);

