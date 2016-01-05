/* Fetch angular from the browser scope */
const angular = window.angular;

/* Module Imports */
import template from './template.html';

const templateUrl = 'wsc-link/template.html';
const WSCLink = angular.module('WSCLink', []);
import directive from './directive';

WSCLink.run([
    '$templateCache',
    function run(
        $templateCache
    ) {

        $templateCache.put(templateUrl, template);
    }
]);

WSCLink.directive('wscLink', directive);

export default WSCLink;
