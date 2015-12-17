
/* Fetch angular from the browser scope */
var angular = window.angular;

/* Cache the template file */
var Telestrations = angular.module('Telestrations');

// Template Caching
Telestrations.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('telestration-clear-all-button-template.html', require('./template.html'));
    }
]);

Telestrations.directive('telestrationClearAllButton', [
    function() {
        return {
            restrict: 'E',
            templateUrl: 'telestration-clear-all-button-template.html',
            require: '^telestrations',
            scope: true,
            link: function(scope, elem, attr, telestrationsController) {

                scope.clearAllButtonClicked = function clearAllButtonClicked() {

                    telestrationsController.currentTelestration.glyphs.clearGlyphs();
                    telestrationsController.telestrationsEntity.remove(telestrationsController.currentTelestration);
                    telestrationsController.selectedGlyph = undefined;
                    telestrationsController.updated();
                    telestrationsController.glyphsCleared();
                    telestrationsController.validateCurrentTelestration();
                    telestrationsController.save();
                };

                elem.on('mousedown', function stopPropagation(event) {

                    event.stopPropagation();
                });
            }
        };
    }
]);
