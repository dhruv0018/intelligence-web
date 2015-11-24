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

            let totalPages = Number(scope.numberOfItems) / Number(scope.pageSize);

            for (let i = 0; i < totalPages; i++) {

                scope.pages.push({
                    number: i,
                    viewNumber: i + 1
                });
            }

            scope.currentPage = 0;

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
                let pages = scope.pages;
                let currentPage = scope.currentPage;
                let leftOffset = currentPage - 1;
                let rightOffset = currentPage + 1;
                let pad = Math.min(scope.numberOfPageButtons * 2, pages.length);

                pageSubset.push(pages[currentPage]);

                while (pad > 0) {

                    if (leftOffset >= 0) {

                        pageSubset.unshift(pages[leftOffset]);
                        leftOffset--;
                        pad--;
                    }

                    if (rightOffset < pages.length) {

                        pageSubset.push(pages[rightOffset]);
                        rightOffset++;
                        pad--;
                    }
                }

                return pageSubset;
            };
        },
        template
    };
}

AdminQueuePagination.directive('adminQueuePagination', adminQueuePagination);

export default adminQueuePagination;
