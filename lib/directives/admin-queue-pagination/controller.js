import PaginationList from '../../../src/collections/paginationList';

AdminQueuePaginationController.$inject = [
    'AdminGamesService',
    'VIEWS',
    '$scope'
];

function AdminQueuePaginationController (
    adminGamesService,
    VIEWS,
    $scope
) {

    let totalPages = Math.ceil($scope.totalCount / VIEWS.QUEUE.GAME.QUERY_SIZE);
    $scope.skipCount = 10;

    function createPaginationList (offset) {

        $scope.pages = new PaginationList(
            totalPages,
            VIEWS.QUEUE.GAME.QUERY_SIZE,
            $scope.numberOfAdjacentPageButtons
        );

        if (offset) {

            let pageNumber = offset / VIEWS.QUEUE.GAME.QUERY_SIZE + 1;
            let startPage = $scope.pages.find(pageNumber);
            $scope.pages.currentPage = startPage;
        }
    }

    $scope.$watch('totalCount', count => createPaginationList());

    createPaginationList();

    $scope.goToPage = function (page) {

        $scope.pages.currentPage = page;
        $scope.paginationDisabled = true;
        adminGamesService.start = page.queryStart;
        adminGamesService.query()
            .then(() => createPaginationList(adminGamesService.start))
            .finally(() => $scope.paginationDisabled = false);
    };

    $scope.goBackSeveral = function () {

        let targetPageNumber = $scope.pages.currentPageNumber - $scope.skipCount;
        let targetPage = $scope.pages.find(targetPageNumber);

        $scope.goToPage(targetPage);
    };

    $scope.goBackOne = function () {

        $scope.pages.statefulIterator.previous();
        let targetPage = $scope.pages.currentPage;

        $scope.goToPage(targetPage);
    };

    $scope.goForwardOne = function () {

        $scope.pages.statefulIterator.next();
        let targetPage = $scope.pages.currentPage;

        $scope.goToPage(targetPage);
    };

    $scope.goForwardSeveral = function () {

        let targetPageNumber = $scope.pages.currentPageNumber + $scope.skipCount;
        let targetPage = $scope.pages.find(targetPageNumber);

        $scope.goToPage(targetPage);
    };
}

export default AdminQueuePaginationController;
