import ColorPickerController from './controller.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

/* Cache the template file */
const Telestrations = angular.module('Telestrations');

const templateUrl = 'color-picker-template.html';


// Template Caching

Telestrations.run(run);

function run($templateCache) {

    $templateCache.put(templateUrl, require('./template.html'));
}

run.$inject = ['$templateCache'];


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
        templateUrl: templateUrl,
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

Telestrations.directive('colorPickerTool', ColorPickerTool);
