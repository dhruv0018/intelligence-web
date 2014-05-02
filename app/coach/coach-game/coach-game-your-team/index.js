/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component settings */
var templateUrl = 'coach/game/your-team.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Your Team page module.
 * @module YourTeam
 */
var YourTeam = angular.module('Coach.Game.YourTeam', []);

/* Cache the template file */
YourTeam.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * YourTeam directive.
 * @module YourTeam
 * @name YourTeam
 * @type {directive}
 */
YourTeam.directive('krossoverCoachGameYourTeam', [
    function directive() {

        var krossoverCoachGameYourTeam = {

            restrict: TO += ELEMENTS,
            templateUrl: templateUrl,
            controller: 'Coach.Game.YourTeam.controller',

            scope: {

                game: '=?'
            }
        };

        return krossoverCoachGameYourTeam;
    }
]);
/**
 * YourTeam controller.
 * @module YourTeam
 * @name YourTeam
 * @type {controller}
 */
YourTeam.controller('Coach.Game.YourTeam.controller', [
    '$scope', '$state', '$localStorage', 'Coach.Game.Tabs', 'Coach.Game.Data', 'PlayersFactory',
    function controller($scope, $state, $localStorage, tabs, data, players) {

        $scope.tabs = tabs;
        $scope.data = data;


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



        $scope.$watch('game', function(game) {

            if (game && game.getRoster && game.teamId) {

                var roster = game.getRoster(game.teamId);

                if (roster) {

                    $scope.rosterId = roster.id;
                }
            }
        });



        $scope.$watch('formYourTeam.$invalid', function(invalid) {

            tabs['opposing-team'].disabled = invalid;
        });

        $scope.$watch('tabs["your-team"].disabled', function(disabled) {

            tabs['opposing-team'].disabled = disabled;
        });

        $scope.save = function() {

            players.save($scope.rosterId, $scope.players);
            tabs.activateTab('opposing-team');
        };
    }
]);

