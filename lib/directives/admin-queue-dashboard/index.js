import controller from './controller';
import service from './service';

/* Constants */
var TO = '';
var ELEMENTS = 'E';

const templateUrl = 'lib/directives/admin-queue-dashboard/template.html';

/**
 * AdminQueueDashboard
 * @module AdminQueueDashboard
 */
var AdminQueueDashboard = angular.module('AdminQueueDashboard', []);

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
                sidebarExpand: '=',
                queue: '=',
                filterCounts: '=',
                games: '='
            }
        };

        return AdminQueueDashboard;
    }
]);

AdminQueueDashboard.service('AdminQueueDashboardService', service);

export default AdminQueueDashboard;
