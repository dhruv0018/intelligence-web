/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'admin-queue-dashboard.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * AdminQueueDashboard
 * @module AdminQueueDashboard
 */
var AdminQueueDashboard = angular.module('AdminQueueDashboard', [
    'Play'
]);

/* Cache the template file */
AdminQueueDashboard.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * AdminQueueDashboard directive.
 * @module AdminQueueDashboard
 * @name AdminQueueDashboard
 * @type {directive}
 */
AdminQueueDashboard.directive('adminQueueDashboard', [
    function directive() {

        var AdminQueueDashboard = {

            restrict: TO += ELEMENTS,

            controller: 'AdminQueueDashboard.controller',

            templateUrl: templateUrl,

            replace: true
        };

        return AdminQueueDashboard;
    }
]);

/**
* AdminQueueDashboard controller
*/
AdminQueueDashboard.controller('AdminQueueDashboard.controller', [
    function controller() {
        console.log('working in the dashboard');
    }
]);
