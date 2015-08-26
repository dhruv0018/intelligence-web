import controller from './controller.js';

const ELEMENTS = 'E';

/* Fetch angular from the browser scope */
const angular = window.angular;

/* Template */
const template    = require('./template.html');
const templateUrl = 'admin-queue-games.html';

/**
 * AdminQueueGames module.
 * @module AdminQueueGames
 */
const AdminQueueGames = angular.module('AdminQueueGames', []);

/* Cache the template file */
AdminQueueGames.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

function adminQueueGames () {

    const definition = {

        restrict: ELEMENTS,
        template,
        controller,
        scope: {

            queue: '=',
            sports: '=',
            leagues: '=',
            teams: '=',
            users: '='
        }
    };

    return definition;
}

AdminQueueGames.directive('adminQueueGames', adminQueueGames);

export default adminQueueGames;
