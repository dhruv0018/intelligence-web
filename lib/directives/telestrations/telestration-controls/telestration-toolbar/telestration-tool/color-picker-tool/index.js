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

function ColorPickerTool($window, TelestrationsEventEmitter) {

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

            element.on('click', function(event) {

                event.stopPropagation();

                scope.colorPicker.telestrationControls.dropdownToggled = !scope.colorPicker.telestrationControls.dropdownToggled;
                scope.$apply();

                if (scope.colorPicker.telestrationControls.dropdownToggled) {

                    TelestrationsEventEmitter.emit('disableDraw');

                    $window.removeEventListener('click', handleWindowClick);
                    $window.addEventListener('click', handleWindowClick);
                }
            });

            function handleWindowClick(event) {

                TelestrationsEventEmitter.emit('enableDraw');
                $window.removeEventListener('click', handleWindowClick);

                telestrationControls.dropdownToggled = false;
                scope.$apply();
            }


            /* Cleanup */

            element.on('$destroy', () => {
                dropdownToggleWatch();
                $window.removeEventListener('click', handleWindowClick);
            });
        }
    };
}

ColorPickerTool.$inject = ['$window', 'TelestrationsEventEmitter'];

Telestrations.directive('colorPickerTool', ColorPickerTool);
