const angular = window.angular;

import ColorPickerController from './controller.js';

const ColorPicterTool = angular.module('ColorPicterTool', []);

// Directive Definition

ColorPickerTool.$inject = [
    '$window',
    'TelestrationsEventEmitter',
    'TELESTRATION_EVENTS'
];

function ColorPickerTool(
    $window,
    TelestrationsEventEmitter,
    TELESTRATION_EVENTS
) {

    return {
        restrict: 'E',
        templateUrl: 'lib/directives/telestrations/telestration-controls/telestration-toolbar/telestration-tool/color-picker-tool/template.html',
        require: ['^telestrations', '^telestrationControls'],
        scope: true,
        controllerAs: 'colorPicker',
        controller: ColorPickerController,
        link: function ColorPickerToolLink(scope, element, attributes, controllers) {

            /* Add dependencies */

            const telestrationsController = controllers[0];
            const telestrationControls = controllers[1];

            /* Listeners/Handlers */

            element.on('click', function onElementClick(event) {

                event.stopPropagation();

                scope.colorPicker.telestrationControls.dropdownToggled = !scope.colorPicker.telestrationControls.dropdownToggled;
                scope.$apply();

                if (scope.colorPicker.telestrationControls.dropdownToggled) {

                    TelestrationsEventEmitter.emit(TELESTRATION_EVENTS.DISABLE_DRAW);

                    $window.removeEventListener('click', onWindowClick);
                    $window.addEventListener('click', onWindowClick);

                } else {

                    TelestrationsEventEmitter.emit(TELESTRATION_EVENTS.ENABLE_DRAW);
                }
            });

            function onWindowClick(event) {

                TelestrationsEventEmitter.emit(TELESTRATION_EVENTS.ENABLE_DRAW);
                $window.removeEventListener('click', onWindowClick);

                telestrationControls.dropdownToggled = false;
                scope.$apply();
            }


            /* Cleanup */

            element.on('$destroy', function onDestroy() {

                $window.removeEventListener('click', onWindowClick);
            });
        }
    };
}

ColorPicterTool.directive('colorPickerTool', ColorPickerTool);

export default ColorPicterTool;
