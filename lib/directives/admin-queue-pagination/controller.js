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

        $scope.paginationList = new PaginationList(
            totalPages,
            VIEWS.QUEUE.GAME.QUERY_SIZE,
            $scope.numberOfAdjacentPageButtons
        );

        if (offset) {

            console.log('offset', offset);
            let pageNumber = offset / VIEWS.QUEUE.GAME.QUERY_SIZE + 1;
            console.log('pageNumber', pageNumber);
            let startPage = $scope.paginationList.find(pageNumber);
            console.log('startPage', startPage);
            $scope.paginationList.currentPage = startPage;
        }
    }

    createPaginationList();

    $scope.goToPage = function (page) {

        // TODO: Add disabled loading state
        console.log('goToPage', page);
        $scope.paginationList.currentPage = page;
        adminGamesService.start = page.queryStart;
        adminGamesService.query()
        .then(() => createPaginationList(adminGamesService.start));
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
