/*
* ReelPillsController dependencies
*/
ReelPillsController.$inject = [
    '$scope'
];

/**
 * ReelPillsController controller.
 * @module ReelPillsController
 * @name ReelPillsController.controller
 * @type {controller}
 */
function ReelPillsController (
    $scope
) {
    $scope.removeReel = function removeReel(reel) {
        if (!reel) return;

        let index = $scope.reels.indexOf(reel);
        $scope.reels.splice(index, 1);
    };
}

export default ReelPillsController;
