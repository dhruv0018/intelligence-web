const angular = window.angular;

import template from './template.html';

const AdminQueuePagination = angular.module('AdminQueuePagination', []);

function adminQueuePagination () {

    return {

        restrict: 'E',
        scope: {
            numberOfItems: '=',
            pageSize: '=',
            numberOfPageButtons: '='
        },
        link: function (scope) {

            scope.pages = [];

            for (let i = 0; i < 500; i++) {

                scope.pages.push({
                    id: i,
                    number: i + 1
                });
            }

            scope.currentPage = 10;

            scope.goToPage = function (page = 0) {

                if (page < 0) {

                    page = 0;
                } else if (page > scope.pages.length - 1) {

                    page = scope.pages.length - 1;
                }

                scope.currentPage = page;
            };

            scope.getCurrentPageSubset = function () {

                let pageSubset = [];
                let prePad = 2;
                let postPad = 2;
                let padIndex = scope.currentPage;

                pageSubset.push(scope.pages[padIndex]);

                while (padIndex - prePad >= 0 && prePad > 0) {

                    padIndex--;
                    pageSubset.unshift(scope.pages[padIndex]);
                    prePad--;
                }

                padIndex = scope.currentPage;

                while (padIndex - postPad >= 0 && postPad > 0) {

                    padIndex++;
                    pageSubset.push(scope.pages[padIndex]);
                    postPad--;
                }

                console.log('pageSubset', pageSubset);
                return pageSubset;
            };
        },
        template
    };
}

AdminQueuePagination.directive('adminQueuePagination', adminQueuePagination);

export default adminQueuePagination;
