import SaveButtonController from './controller.js';

/* Constants */
let TO = '';
const ELEMENTS = 'E';

const templateUrl = 'saveButton.html';

/* Component resources */
const template = require('./template.html');

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * SaveButton
 * @module SaveButton
 */
const SaveButton = angular.module('SaveButton', []);

/* Cache the template file */
SaveButton.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * SaveButton directive.
 * @module SaveButton
 * @name SaveButton
 * @type {directive}
 */
SaveButton.directive('saveButton', [
    function directive() {

        const saveButton = {

            restrict: TO += ELEMENTS,

            scope: {

                resource: '=?',
                isSaving: '=?',
                confirmSave: '=?'
            },

            controller: SaveButtonController,

            templateUrl: templateUrl,
        };

        return saveButton;
    }
]);
