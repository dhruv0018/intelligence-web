/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

var templateUrl = 'team-typeahead/template.html';

/**
 * TeamTypeahead
 * @module TeamTypeahead
 */
var TeamTypeahead = angular.module('team-typeahead', []);

/* Cache the template file */
TeamTypeahead.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, require('./template.html'));
        $templateCache.put('team-typeahead-dropdown.html', require('./team-typeahead-dropdown.html'));
    }
]);

/**
 * TeamTypeahead directive.
 * @module TeamTypeahead
 * @name TeamTypeahead
 * @type {Directive}
 */
TeamTypeahead.directive('teamTypeahead', [
    'TeamsFactory', 'SchoolsFactory', 'LeaguesFactory',
    function directive(teams, schools, leagues) {

        var teamTypeahead = {

            restrict: TO += ELEMENTS,

            replace: true,

            scope: {

                team: '=',
                sportId: '=',
                teamId: '=ngModel'
            },

            link: link,

            templateUrl: templateUrl
        };

        function link(scope, element, attributes) {

            scope.findTeams = function() {

                scope.leaguesCollection = leagues.getCollection();

                scope.schools = scope.schools || {};

                return teams.query({
                    name: scope.team,
                    count: 10,
                    sportId: scope.sportId
                }).then(function(teams) {
                    var schoolIds = [];

                    angular.forEach(teams, function(team) {
                        if (team.schoolId) {
                            schoolIds.push(team.schoolId);
                        }
                    });

                    if (schoolIds.length > 0) {
                        return schools.load({
                            'id[]': schoolIds
                        }).then(function(schools) {
                            scope.schools = schools.getCollection();

                            angular.forEach(teams, function(team) {
                                team.displaySchool = (team.schoolId) ? scope.schools[team.schoolId] : null;
                                team.displayLeague = (team.leagueId) ? scope.leaguesCollection[team.leagueId] : null;
                            });

                            return teams;
                        });
                    } else {
                        return teams;
                    }

                });
            };

            scope.getId = function($item) {
                scope.teamId = $item.id;
            };

        }

        return teamTypeahead;
    }
]);


