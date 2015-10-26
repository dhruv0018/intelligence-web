/* Fetch angular from the browser scope */
const angular = window.angular;

/* Module Imports */
import template from './template.html';

const templateUrl = 'event-adjuster/template.html';
const EventAdjuster = angular.module('EventAdjuster', []);
import directive from './directive';

EventAdjuster.run([
    '$templateCache',
    function run(
        $templateCache
    ) {

        $templateCache.put(templateUrl, template);
    }
]);

EventAdjuster.directive('krossoverEventAdjuster', directive);

export default EventAdjuster;
