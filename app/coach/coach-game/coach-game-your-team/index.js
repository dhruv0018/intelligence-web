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
                roster: '=?',
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
    '$scope', '$state', '$localStorage', 'Coach.Game.Tabs', 'Coach.Data', 'PlayersFactory',
    function controller($scope, $state, $localStorage, tabs, data, players) {

        $scope.tabs = tabs;
        //$scope.data = data;

        data.then(function(coachData) {
            console.log('inside of the team ctrl');
            $scope.data = coachData;
        });


        /* FIXME: Remove, this is just temp. */
        //$scope.players = $scope.roster;
        $scope.$watch('roster', function(roster){
            console.log('in the your team ctrl');
            console.log(roster);
        });

        /* END TEMP */



        $scope.$watch('game', function(game) {

//            if (game && game.getRoster && game.teamId) {
//
//                var roster = game.getRoster(game.teamId);
//
//                if (roster) {
//
//                    $scope.rosterId = roster.id;
//                }
//            }
            console.log(game);
        });



        $scope.$watch('formYourTeam.$invalid', function(invalid) {

            tabs['opposing-team'].disabled = invalid;
        });

        $scope.$watch('tabs["your-team"].disabled', function(disabled) {

            tabs['opposing-team'].disabled = disabled;
        });

        $scope.save = function() {

            players.save($scope.game.rosters[$scope.game.teamId].id, $scope.roster.players);
            tabs.activateTab('opposing-team');
        };
    }
]);

