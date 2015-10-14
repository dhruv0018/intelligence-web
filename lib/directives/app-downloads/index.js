/* Constants */
let TO = '';
const ELEMENTS = 'E';

/* Component resources */
import template from './template.html';
import controller from './controller';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
* AppDownloads
* @module AppDownloads
*/
const AppDownloads = angular.module('AppDownloads', [
]);

function AppDownloadsDirective(
) {

    let directive = {

        restrict: TO += ELEMENTS,
        template,
        controller
    };

    return directive;
}

AppDownloads.directive('appDownloads', AppDownloadsDirective);

export default AppDownloads;
