const angular = window.angular;

const TelestrationDeleteButton = angular.module('TelestrationDeleteButton', []);

TelestrationDeleteButton.directive('telestrationDeleteButton', [
    function() {
        return {
            restrict: 'E',
            templateUrl: 'lib/directives/telestrations/telestration-controls/telestration-delete-button/template.html',
            require: '^telestrations',
            scope: true,
            link: function(scope, elem, attr, telestrationsController) {

                scope.deleteButtonClicked = () => {

                    telestrationsController.currentTelestration.glyphs.remove(telestrationsController.selectedGlyph);
                    telestrationsController.selectedGlyph = undefined;
                    telestrationsController.updated();
                    telestrationsController.glyphDeleted();
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

export default TelestrationDeleteButton;
