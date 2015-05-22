import controller from './controller.js';

/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'admin-queue-dashboard.html';

/* Component resources */
var template = require('./template.html');

/**
 * AdminQueueDashboard
 * @module AdminQueueDashboard
 */
var AdminQueueDashboard = angular.module('AdminQueueDashboard', []);

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
            controller,
            templateUrl,
            //queue is the currently displayed games
            //games is the total number of games (ALL games from all the filters)
            scope: {
                queue: '=',
                games: '='
            }
        };

        return AdminQueueDashboard;
    }
]);

/**
 * AdminQueueDashboard filter.
 * @module AdminQueueDashboard
 * @name zeroPad
 * @type {filter}
 */
AdminQueueDashboard.filter('zeroPad', function() {
    return function(input) {
        let length = Number(input);
        return length >= 10 ? length : '0' + length;
    };
});
