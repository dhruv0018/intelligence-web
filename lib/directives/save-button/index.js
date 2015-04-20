/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * SaveButton
 * @module SaveButton
 */
var SaveButton = angular.module('SaveButton', []);

/* Cache the template file */
SaveButton.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('saveButton.html', template);
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

        var saveButton = {

            restrict: TO += ELEMENTS,

            scope: {

                resource: '=?',
                isSaving: '=?',
                confirmSave: '=?'
            },

            controller: 'SaveButton.controller',

            templateUrl: 'saveButton.html',
        };

        return saveButton;
    }
]);

/* File dependencies */
require('./controller');
