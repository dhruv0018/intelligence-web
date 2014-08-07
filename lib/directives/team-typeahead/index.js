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
    }
]);

/**
 * TeamTypeahead directive.
 * @module TeamTypeahead
 * @name TeamTypeahead
 * @type {Directive}
 */
TeamTypeahead.directive('teamTypeahead', [
    function directive() {

        var teamTypeahead = {

            restrict: TO += ELEMENTS,

            replace: true,

            scope: {

                team: '='
            },

            link: link,

            templateUrl: templateUrl
        };

        function link(scope, element, attributes) {

            scope.findTeams = function() {
                var mockResults = [
                    {id: 1, result: 'Test Team'},
                    {id: 2, result: 'Texas Team'},
                    {id: 3, result: 'Alabama'}
                ];
                return mockResults;
            };

        }

        return teamTypeahead;
    }
]);


