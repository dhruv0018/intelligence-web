/* Constants */
let TO = '';
const ELEMENTS = 'E';

/* Fetch angular from the browser scope */
let angular = window.angular;

/* Template */
const template = require('./template.html');

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

        template: template
    };

    return definition;
}

TermsAndConditions.directive('termsAndConditions', termsAndConditions);
