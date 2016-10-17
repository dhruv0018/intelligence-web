/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

var templateUrl = 'lib/directives/team-info/template.html';

/**
 * TeamInfo
 * @module TeamInfo
 */
var TeamInfo = angular.module('team-info', []);

/**
 * TeamInfo directive.
 * @module TeamInfo
 * @name TeamInfo
 * @type {Directive}
 */
TeamInfo.directive('krossoverTeamInfo', [
    function directive() {

        var krossoverTeamInfo = {

            restrict: TO += ELEMENTS,

            replace: true,

            scope: {

                team: '='
            },

            link: link,

            templateUrl: templateUrl,

            controller: 'team-info.controller',
        };

        function link($scope, element, attributes) {

        }

        return krossoverTeamInfo;
    }
]);

/**
 * TeamInfo controller
 * @module TeamInfo
 * @name team-info.Controller
 * @type {Controller}
 */
TeamInfo.controller('team-info.controller', [
    '$scope', 'LeaguesFactory', 'SportsFactory',
    function controller($scope, leagues, sports) {

        $scope.sports = sports.getCollection();
        $scope.leagues = leagues.getCollection();
    }
]);

export default TeamInfo;
