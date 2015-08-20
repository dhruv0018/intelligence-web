const ELEMENTS = 'E';

/* Fetch angular from the browser scope */
const angular = window.angular;

/* Template */
const template = require('./template.html');

/**
 * FormToggle module.
 * @module FormToggle
 */
const FormToggle = angular.module('FormToggle', []);

function formToggle () {

    const definition = {

        restrict: ELEMENTS,
        transclude: true,
        require: '?^form',
        template,
        scope: {

            model: '=',
            name: '@',
            required: '@',
            id: '@'
        },
        link: function (scope, elements, attributes, form) {

            scope.form = form;
        }
    };

    return definition;
}

FormToggle.directive('formToggle', formToggle);

export default formToggle;
