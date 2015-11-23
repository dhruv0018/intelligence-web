const angular = window.angular;

import template from './template.html';

const AdminQueuePagination = angular.module('AdminQueuePagination', []);

function adminQueuePagination () {

    return {

        restrict: 'E',
        link: function (scope) {

            scope.pages = [
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {}
            ];

            scope.currentPage = 0;

            scope.goToPage = function (page = 0) {

                scope.currentPage = page;
            };
        },
        template
    };
}

AdminQueuePagination.directive('adminQueuePagination', adminQueuePagination);

export default adminQueuePagination;
