/* Fetch angular from the browser scope */
var angular = window.angular;

/* Cache the template file */
var Telestrations = angular.module('Telestrations');

// Template Caching
Telestrations.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('undo-tool-template.html', require('./template.html'));
    }
]);

Telestrations.directive('undoTool', [
    function() {
        return {
            restrict: 'E',
            require: ['^telestrations', '^telestrationControls'],
            templateUrl: 'undo-tool-template.html',
            scope: true,
            link: function(scope, elem, attr, controllers) {

                var telestrationsController = controllers[0];
                var telestrationsControlController = controllers[1];

                scope.telestrationControls = telestrationsControlController;
                scope.disabled = true;

                scope.undoGlyph = function undoGlyph() {

                    telestrationsController.currentTelestration.glyphs.popGlyph();

                    if (!telestrationsController.currentTelestration.glyphs.length) telestrationsController.$save(telestrationsController.$updated);
                    else telestrationsController.$save();
                };

                scope.$watch(function() {
                    return telestrationsControlController.areGlyphsPresent();
                }, function(areGlyphsPresent) {
                    scope.disabled = areGlyphsPresent ? false : true;
                });
            }
        };
    }
]);
