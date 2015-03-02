
/* Fetch angular from the browser scope */
var angular = window.angular;

var Telestrations = angular.module('Telestrations');

/* Cache the template file */

var templateUrl = 'telestration-glyph-editor-template.html';

// Template Caching
Telestrations.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, require('./template.html'));
    }
]);


Telestrations.directive('glyphEditor', GlyphEditor);

GlyphEditor.$inject = [];

function GlyphEditor() {
    return {
        restrict: 'AE',
        scope: true,
        templateUrl: templateUrl,
        require: '^telestrations',
        controller: require('./controller'),
        transclude: true
    };
}
