/* Constants */
let TO = '';
const ELEMENTS = 'E';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Sport Placeholder
 * @module Sport Placeholder
 */
const SportPlaceholder = angular.module('sport-placeholder', []);

/**
 * Sport Placeholder directive.
 * @module Sport Placeholder
 * @name Sport Placeholder
 * @type {Directive}
 */
SportPlaceholder.directive('sportPlaceholder', [

    function directive() {

        const sportplaceholder = {

            restrict: TO += ELEMENTS,

            scope: {
                sport: '='
            },

            templateUrl: 'lib/directives/sport-placeholder/template.html',

        };

        return sportplaceholder;
    }
]);

export default SportPlaceholder;
