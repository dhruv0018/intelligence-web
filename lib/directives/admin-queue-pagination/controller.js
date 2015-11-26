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

    $scope.paginationList = new PaginationList(
        totalPages,
        $scope.numberOfAdjacentPageButtons
    );

    $scope.goToPage = function (page) {

        console.log('goToPage', page);
        $scope.paginationList.currentPage = page;
        adminGamesService.start = page.queryStart;
        Admingames.query();
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
