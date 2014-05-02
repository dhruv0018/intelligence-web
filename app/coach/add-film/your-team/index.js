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
                firstName: 'Hector',
                lastName: 'Rosa',
                position: 'MB',
                jerseyNumbers: {
                    '9001': 22
                },
                picture: {
                    url: 'assets/tmp/roster/0000.jpg'
                },
                played: true
            },
            {
                firstName: 'Billy',
                lastName: 'Blau',
                position: 'MH',
                jerseyNumbers: {
                    '9001': 33
                },
                picture: {
                    url: 'assets/tmp/roster/0001.jpg'
                },
                played: true
            },
            {
                firstName: 'Greg',
                lastName: 'Grunhilda',
                position: 'RH',
                jerseyNumbers: {
                    '9001': 44
                },
                picture: {
                    url: 'assets/tmp/roster/0002.jpg'
                },
                played: true
            },
            {
                firstName: 'Walter',
                lastName: 'Gelber',
                position: 'LH',
                jerseyNumbers: {
                    '9001': 55
                },
                picture: {
                    url: 'assets/tmp/roster/0003.jpg'
                },
                played: true
            },
            {
                firstName: 'Ringo',
                lastName: 'Braun',
                position: 'DS',
                jerseyNumbers: {
                    '9001': 66
                },
                picture: {
                    url: 'assets/tmp/roster/0004.jpg'
                },
                played: true
            },
            {
                firstName: 'Richard',
                lastName: 'Beige',
                position: 'H',
                jerseyNumbers: {
                    '9001': 77
                },
                picture: {
                    url: 'assets/tmp/roster/0005.jpg'
                },
                played: true
            },
            {
                firstName: 'Kurt',
                lastName: 'Violett',
                position: 'B',
                jerseyNumbers: {
                    '9001': 88
                },
                picture: {
                    url: 'assets/tmp/roster/0006.jpg'
                },
                played: true
            },
            {
                firstName: 'Illian',
                lastName: 'Mauve',
                position: 'OB',
                jerseyNumbers: {
                    '9001': 99
                },
                picture: {
                    url: 'assets/tmp/roster/0007.jpg'
                },
                played: true
            },
            {
                firstName: 'David',
                lastName: 'Weisse',
                position: 'S',
                jerseyNumbers: {
                    '9001': 14
                },
                picture: {
                    url: 'assets/tmp/roster/0008.jpg'
                },
                played: true
            },
            {
                firstName: 'Alfonso',
                lastName: 'Schwarz',
                position: 'H',
                jerseyNumbers: {
                    '9001': 25
                },
                picture: {
                    url: 'assets/tmp/roster/0009.jpg'
                },
                played: true
            },
            {
                firstName: 'Anthony',
                lastName: 'Grau',
                position: 'B',
                jerseyNumbers: {
                    '9001': 36
                },
                picture: {
                    url: 'assets/tmp/roster/0000.jpg'
                },
                played: true
            },
            {
                firstName: 'Stan',
                lastName: 'Turk',
                position: 'DS',
                jerseyNumbers: {
                    '9001': 47
                },
                picture: {
                    url: 'assets/tmp/roster/0001.jpg'
                },
                played: true
            },
            {
                firstName: 'Arnold',
                lastName: 'Silber',
                position: 'H',
                jerseyNumbers: {
                    '9001': 58
                },
                picture: {
                    url: 'assets/tmp/roster/0002.jpg'
                },
                played: true
            },
            {
                firstName: 'Scott',
                lastName: 'Gold',
                position: 'B',
                jerseyNumbers: {
                    '9001': 69
                },
                picture: {
                    url: 'assets/tmp/roster/0003.jpg'
                },
                played: true
            }
        ];
        /* END TEMP */

        $scope.$storage.game.yourRoster = $scope.$storage.game.yourRoster ||
                                          $scope.$storage.game.getRoster($scope.$storage.game.teamId);

        $scope.rosterId = $scope.$storage.game.yourRoster.id;


        $scope.$watch('formYourTeam.$invalid', function(invalid) {

            tabs['opposing-team'].disabled = invalid;
        });

        $scope.save = function() {

            players.save($scope.rosterId, $scope.players);
            tabs['your-team'].active = false;
            tabs['opposing-team'].active = true;
            $state.go('opposing-team');
        };
    }
]);

