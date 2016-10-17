const ELEMENTS = 'E';

/* Fetch angular from the browser scope */
const angular = window.angular;

/* Template */
const templateUrl = 'lib/directives/form-toggle/template.html';

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
        templateUrl,
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

export default FormToggle;
