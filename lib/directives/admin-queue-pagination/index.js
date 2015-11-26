const angular = window.angular;

import template from './template.html';
import controller from './controller';

const AdminQueuePagination = angular.module('AdminQueuePagination', []);

function adminQueuePagination () {

    return {

        restrict: 'E',
        scope: {
            totalCount: '=',
            numberOfAdjacentPageButtons: '='
        },
        controller,
        template
    };
}

AdminQueuePagination.directive('adminQueuePagination', adminQueuePagination);

export default adminQueuePagination;
