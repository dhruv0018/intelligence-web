const angular = window.angular;

const TelestrationClearAllButton = angular.module('TelestrationClearAllButton', []);

TelestrationClearAllButton.directive('telestrationClearAllButton', [
    function() {
        return {
            restrict: 'E',
            templateUrl: 'lib/directives/telestrations/telestration-controls/telestration-clear-all-button/template.html',
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
                    telestrationsController.removeTelestration(telestrationsController.currentTelestration);
                };

                elem.on('mousedown', function stopPropagation(event) {

                    event.stopPropagation();
                });
            }
        };
    }
]);

export default TelestrationClearAllButton;
