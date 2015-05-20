/* Fetch angular from the browser scope */
const angular = window.angular;

/*
* CustomTagPillsController dependencies
*/
CustomTagPillsController.$inject = [
    '$scope',
    'PlaysFactory',
    'PlaylistEventEmitter',
    'CUSTOM_TAGS_EVENTS'
];

/**
 * CustomTagPillsController controller.
 * @module CustomTagPillsController
 * @name CustomTagPillsController.controller
 * @type {controller}
 */
function CustomTagPillsController (
    $scope,
    plays,
    playlistEventEmitter,
    CUSTOM_TAGS_EVENTS
) {

    $scope.removeTag = function removeTag(tag) {
        if (!tag) return;

        let index = $scope.selectedTags.indexOf(tag);
        $scope.selectedTags.splice(index, 1);

        if ($scope.play) {
            $scope.play.customTagIds = $scope.selectedTags.map(tag => tag.id);
            $scope.play.save();
            playlistEventEmitter.emit(CUSTOM_TAGS_EVENTS.SAVE);
        }
    };
}

export default CustomTagPillsController;
