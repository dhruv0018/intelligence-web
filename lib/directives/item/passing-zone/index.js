/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'item/passing-zone.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * PassingZone
 * @module PassingZone
 */
var PassingZone = angular.module('Item.PassingZone', []);

/* Cache the template file */
PassingZone.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * PassingZone directive.
 * @module PassingZone
 * @name PassingZone
 * @type {Directive}
 */
PassingZone.directive('krossoverItemPassingZone', [
    'ZONES', 'ZONE_IDS',
    function directive(ZONES, ZONE_IDS) {

        var PassingZone = {

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

            $scope.ZONES = ZONES;
            $scope.ZONE_IDS = ZONE_IDS;
        }

        return PassingZone;
    }
]);
