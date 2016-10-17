import IndexingModalDeletePlayController from '../../../../app/indexing/modal-delete-play-controller';

const IndexingModalDeletePlayTemplateUrl = 'app/indexing/modal-delete-play.html';

// Dependencies
PlayFooterController.$inject = [
    '$scope',
    '$modal',
    'PlayManager',
    'IndexingService'
];

function PlayFooterController (
    $scope,
    $modal,
    playManager,
    indexing
) {

    /**
     * Deletes this play.
     */
    $scope.deletePlay = function () {

        $modal.open({

            controller: IndexingModalDeletePlayController,
            templateUrl: IndexingModalDeletePlayTemplateUrl
        }).result.then(() => {

            indexing.showTags = true;
            indexing.showScript = false;
            indexing.eventSelected = false;
            indexing.isIndexing = false;

            playManager.remove($scope.play);
        });
    };
}

export default PlayFooterController;
