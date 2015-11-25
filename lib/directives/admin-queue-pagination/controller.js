import Page from './page';
import List from '../../../src/collections/list';

AdminQueuePaginationController.$inject = [
    // 'AdminGamesService',
    'VIEWS',
    '$scope'
];

function AdminQueuePaginationController (
    // adminGamesService,
    VIEWS,
    $scope
) {

    $scope.currentPage = 0;

    /* TEMP */
    let numberOfItems = 7000;
    /* TEMP */

    let pages = [];
    let totalPages = numberOfItems / VIEWS.QUEUE.GAME.QUERY_SIZE;
    const SKIP_COUNT = 10;

    for (let pageNumber = 0; pageNumber < totalPages; pageNumber++) {

        pages.push(new Page(pageNumber));
    }

    $scope.pages = new List($scope.pages);

    $scope.goToPage = function (page) {

        $scope.currentPage = page.number;
    };

    $scope.goBackSeveral = function () {

        let targetPage = $scope.pages[$scope.currentPage - SKIP_COUNT];
        $scope.goToPage(targetPage);
    };

    $scope.goBackOne = function () {

        let targetPage = $scope.pages[$scope.currentPage - 1];
        $scope.goToPage(targetPage);
    };

    $scope.goForwardOne = function () {

        let targetPage = $scope.pages[$scope.currentPage + 1];
        $scope.goToPage(targetPage);
    };

    $scope.goForwardSeveral = function () {

        let targetPage = $scope.pages[$scope.currentPage + SKIP_COUNT];
        $scope.goToPage(targetPage);
    };

    $scope.getCurrentPageSubset = function () {

        let pageSubset = [];
        let pages = $scope.pages;
        let currentPage = $scope.currentPage;
        let leftOffset = currentPage - 1;
        let rightOffset = currentPage + 1;
        let adjacentPagesToAdd = Math.min($scope.numberOfAdjacentPageButtons * 2, pages.length);

        pageSubset.push(pages[currentPage]);

        while (adjacentPagesToAdd > 0) {

            if (leftOffset >= 0) {

                pageSubset.unshift(pages[leftOffset]);
                leftOffset--;
                adjacentPagesToAdd--;
            }

            if (rightOffset < pages.length) {

                pageSubset.push(pages[rightOffset]);
                rightOffset++;
                adjacentPagesToAdd--;
            }
        }

        return pageSubset;
    };
}

export default AdminQueuePaginationController;
