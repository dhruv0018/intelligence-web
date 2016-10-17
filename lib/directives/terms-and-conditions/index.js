import controller from './controller.js';

/* Constants */
let TO = '';
const ELEMENTS = 'E';

/* Fetch angular from the browser scope */
let angular = window.angular;

/**
 * TermsAndConditions module.
 * @module TermsAndConditions
 */
let TermsAndConditions = angular.module('TermsAndConditions', []);

/**
 * TermsAndConditions dependencies.
 */
termsAndConditions.$inject = [];

/**
 * TermsAndConditions directive.
 * @module TermsAndConditions
 * @name TermsAndConditions
 * @type {directive}
 */
function termsAndConditions (
) {

    const definition = {

        restrict: TO += ELEMENTS,
        templateUrl: 'lib/directives/terms-and-conditions/template.html',
        controller
    };

    return definition;
}

TermsAndConditions.directive('termsAndConditions', termsAndConditions);

export default TermsAndConditions;
