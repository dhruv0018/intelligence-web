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

            games: '=',
            queue: '=',
            sports: '=',
            leagues: '=',
            teams: '=',
            users: '='
        }
    };
}

AdminQueueGames.directive('adminQueueGames', adminQueueGames);

export default adminQueueGames;
