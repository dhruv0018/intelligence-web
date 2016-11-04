/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

var templateUrl = 'lib/directives/team-typeahead/template.html';

/**
 * TeamTypeahead
 * @module TeamTypeahead
 */
var TeamTypeahead = angular.module('team-typeahead', []);

/**
 * TeamTypeahead directive.
 * @module TeamTypeahead
 * @name TeamTypeahead
 * @type {Directive}
 */
TeamTypeahead.directive('teamTypeahead', [
    'v3TeamsFactory',
    function directive(teamsV3) {

        var teamTypeahead = {

            restrict: TO += ELEMENTS,

            replace: true,

            scope: {

                elementId: '@',
                team: '=',
                sportId: '=?',
                teamId: '=ngModel',
                withoutRole: '=?',
                customerTeams: '=?',
                required: '=?',
                txtPlaceholder: '@'
            },

            link: link,

            templateUrl: templateUrl
        };

        function link(scope, element, attributes) {
            scope.results = null;
            scope.findTeams = function() {
                scope.results = null;

                var filter = {
                    schoolOrTeamName: scope.team,
                    include: 'school,league'
                };

                if (scope.sportId) {
                    filter.sportId = scope.sportId;
                }

                if (angular.isDefined(scope.customerTeams)) {
                    filter.isCustomerTeam = scope.customerTeams ? 1 : 0;
                }

                if (scope.withoutRole) {
                    filter.noRoleType = scope.withoutRole.type.id;
                }

                return teamsV3.load(filter);
            };

            scope.getId = function($item) {
                scope.teamId = parseInt($item.id, 10);
                let placeholderText = $item.attributes.name;

                if ($item.getSchool()) {
                    placeholderText += ", " + $item.getSchool().attributes.name;
                }
                if ($item.getLeague()) {
                    placeholderText += ", " + $item.getLeague().attributes.name;
                }
                scope.txtPlaceholder = placeholderText;
            };

        }

        return teamTypeahead;
    }
]);

export default TeamTypeahead;
