
/* Fetch angular from the browser scope */
var angular = window.angular;

var Telestrations = angular.module('Telestrations');

/* Cache the template file */

var templateUrl = 'glyph-template.html';

// required sub-directives
require('non-svg-glyph');
require('svg-glyph');

// Template Caching
Telestrations.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, require('./template.html'));
    }
]);


// Directive
Telestrations.directive('glyph', Glyph);

Glyph.$inject = ['TELESTRATION_TYPES'];

function Glyph(TELESTRATION_TYPES) {
    return {
        restrict: 'E',
        templateUrl: templateUrl,
        scope: {
            glyphObject: '='
        },
        link: function linkGlyph($scope) {

            $scope.TELESTRATION_TYPES = TELESTRATION_TYPES;
        }
    };
}
