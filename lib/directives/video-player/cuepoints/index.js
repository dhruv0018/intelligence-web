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

var CUEPOINT_TYPES = {
    'TELESTRATION': 1,
    'EVENT': 2
};

CuePoints.constant('CUEPOINT_TYPES', CUEPOINT_TYPES);

/**
 * Sets cue points on scrubber
 * Based on vg-cuepoints (
 * @module CuePoints
 * @name CuePoints
 * @type {directive}
 */
CuePoints.directive('koiCuepoints', [
    'CUEPOINT_TYPES',
    function(CUEPOINT_TYPES) {

        var directive = {

            restrict: TO += ELEMENTS,
            link: link,
            templateUrl: 'cuepoints.html',
            require: ['^videogular', '^videoPlayer']
        };

        function link(scope, element, attributes, controllers) {
            var API = controllers[0];
            scope.cuePoints = controllers[1].cuePoints;
            scope.CUEPOINT_TYPES = CUEPOINT_TYPES;

            scope.calcLeft = function(cuepoint) {
                if (API.totalTime === 0) return '-1000';

                var videoLength = API.totalTime / 1000;
                return ((cuepoint.time / videoLength) * 100).toString();
            };
        }

        return directive;
    }
]);

