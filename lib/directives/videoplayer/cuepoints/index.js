/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * CuePoints
 * @module CuePoints
 */
var CuePoints = angular.module('koi-cue-points', []);

/* Cache the template file */
CuePoints.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('cuepoints.html', require('./template.html'));
    }
]);


/**
 * Sets cue points on scrubber
 * @module CuePoints
 * @name CuePoints
 * @type {directive}
 */
CuePoints.directive('koiCuepoints', [
    function() {

        var directive = {

            restrict: TO += ELEMENTS,
            link: link,
            scope: {
                cuePoints: '='
            },
            templateUrl: 'cuepoints.html'
        };

        function link(scope, element, attributes, controller) {
            console.log('still working cuepoints');
            console.log(scope.cuePoints);
        }

        return directive;
    }
]);

