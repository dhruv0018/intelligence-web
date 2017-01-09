import typeheadCtrl from './controller';

/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

var templateUrl = 'lib/directives/canonical-team-typeahead/template.html';

/**
 * TeamTypeahead
 * @module TeamTypeahead
 */
var CanonicalTeamTypeahead = angular.module('canonical-team-typeahead', []);

/**
 * triggerTypeahead directive, hack to trigger the drop down list to show
 * @module triggerTypeahead
 * @name triggerTypeahead
 * @type {Directive}
 */
CanonicalTeamTypeahead.directive('triggerTypeahead', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            element.bind('focus', function(){
                modelCtrl.$setViewValue();
            });
        }
    };
});

/**
 * TeamTypeahead directive.
 * @module TeamTypeahead
 * @name TeamTypeahead
 * @type {Directive}
 */
CanonicalTeamTypeahead.directive('canonicalTeamTypeahead', [
    function directive() {

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
                notAllowed: '=',
                txtPlaceholder: '@'
            },

            controller: typeheadCtrl,

            templateUrl: templateUrl
        };

        return teamTypeahead;
    }
]);

export default CanonicalTeamTypeahead;
