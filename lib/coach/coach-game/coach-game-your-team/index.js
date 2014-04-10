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
            controller: 'Coach.Game.YourTeam.controller'
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

        $scope.data = data;

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

        //data.game.yourRoster = data.game.yourRoster ||
                                          //data.game.getRoster(data.game.teamId);

        //$scope.rosterId = data.game.yourRoster.id;

        /* TEMP */
        $scope.players[0].jerseyNumbers[$scope.rosterId] = '24';
        $scope.players[1].jerseyNumbers[$scope.rosterId] = '24';
        $scope.players[2].jerseyNumbers[$scope.rosterId] = '24';
        $scope.players[3].jerseyNumbers[$scope.rosterId] = '24';
        console.dir($scope.players);
        /* END TEMP */

        $scope.save = function() {

            players.save($scope.rosterId, $scope.players);
            tabs['your-team'].active = false;
            tabs['opposing-team'].active = true;
            $state.go('opposing-team');
        };
    }
]);

