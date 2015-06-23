
/* Fetch angular from the browser scope */
var angular = window.angular;

/* Cache the template file */
var Telestrations = angular.module('Telestrations');

// Template Caching
Telestrations.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('telestration-delete-button-template.html', require('./template.html'));
    }
]);

Telestrations.directive('telestrationDeleteButton', [
    function() {
        return {
            restrict: 'E',
            templateUrl: 'telestration-delete-button-template.html',
            require: '^telestrations',
            scope: true,
            link: function(scope, elem, attr, telestrationsController) {

                scope.deleteButtonClicked = () => {

                    telestrationsController.currentTelestration.glyphs.remove(telestrationsController.selectedGlyph);
                    telestrationsController.selectedGlyph = undefined;
                    telestrationsController.updated();
                    telestrationsController.save();
                    telestrationsController.glyphDeleted();
                    telestrationsController.validateCurrentTelestration();
                };

                elem.on('mousedown', function stopPropagation(event) {

                    event.stopPropagation();
                });
            }
        };
    }
]);
