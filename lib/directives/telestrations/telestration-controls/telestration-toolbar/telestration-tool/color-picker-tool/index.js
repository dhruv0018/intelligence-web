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

function ColorPickerTool($window) {

    return {
        restrict: 'E',
        templateUrl: templateUrl,
        require: ['^telestrations', '^telestrationControls'],
        scope: true,
        controllerAs: 'colorPicker',
        controller: ColorPickerController,
        link: function ColorPickerToolLink(scope, element, attributes, controllers) {

            /* Add dependencies */

            let telestrationsController = controllers[0];
            let telestrationControls = controllers[1];


            /* Listeners/Handlers */

            // $window.addEventListener('click', handleWindowClick);

            // function handleWindowClick(event) {

            //     if (event.target !== element[0]) {
            //         console.log('blur');
            //         telestrationControls.dropdownToggled = false;
            //     }
            // }


            /* Cleanup */

            element.on('$destroy', () => {

                $window.removeEventListener('click', handleWindowClick);
            });
        }
    };
}

ColorPickerTool.$inject = ['$window'];

Telestrations.directive('colorPickerTool', ColorPickerTool);
