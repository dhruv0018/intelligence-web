/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'item/gap.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Gap
 * @module Gap
 */
var Gap = angular.module('Item.Gap', []);

/* Cache the template file */
Gap.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Gap directive.
 * @module Gap
 * @name Gap
 * @type {Directive}
 */
Gap.directive('krossoverItemGap', [
    'GAPS', 'GAP_IDS',
    function directive(GAPS, GAP_IDS) {

        var Gap = {

            restrict: TO += ELEMENTS,

            replace: true,

            scope: {
                item: '=',
                event: '='
            },

            link: link,

            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

            $scope.GAPS = GAPS;
            $scope.GAP_IDS = GAP_IDS;
        }

        return Gap;
    }
]);
