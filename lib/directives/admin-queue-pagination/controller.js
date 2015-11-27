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

        let targetPage = $scope.pages[$scope.currentPage - skipCount];
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

        let targetPage = $scope.pages[$scope.currentPage + skipCount];
        $scope.goToPage(targetPage);
    };
}

export default AdminQueuePaginationController;
