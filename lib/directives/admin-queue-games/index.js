const angular = window.angular;

import controller from './controller.js';
import template from './template.html';

const AdminQueueGames = angular.module('AdminQueueGames', []);

function adminQueueGames () {

    return {

        restrict: 'E',
        template,
        controller,
        scope: {

            priority1Games: '=',
            priority2Games: '=',
            priority3Games: '=',
            sports: '=',
            leagues: '=',
            teams: '=',
            users: '='
        }
    };
}

AdminQueueGames.directive('adminQueueGames', adminQueueGames);

export default adminQueueGames;
