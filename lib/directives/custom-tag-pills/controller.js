/* Fetch angular from the browser scope */
const angular = window.angular;

/*
* CustomTagPillsController dependencies
*/
CustomTagPillsController.$inject = [
    '$scope',
    'PlaysFactory',
    'PlaylistEventEmitter',
    'SessionService',
    'CustomTagsEvent',
    'ROLES',
    'PlaysManager',
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
    session,
    CustomTagsEvent,
    ROLES,
    playsManager,
    CUSTOM_TAGS_EVENTS
) {

    $scope.currentUser = session.getCurrentUser();
    $scope.ROLES = ROLES;

    $scope.removeTag = function removeTag(tag) {
        if (!tag) return;

        let index = $scope.selectedTags.indexOf(tag);
        $scope.selectedTags.splice(index, 1);

        if ($scope.play) {
            $scope.play.customTagIds = $scope.selectedTags.map(tag => tag.id);
            $scope.play.save().then(() => playsManager.calculatePlays());

            let updatedPlayIds = [$scope.play.id];
            let updatedTagCount = 1;
            let showConfirmation = false;

            let customTagsEvent = new CustomTagsEvent(updatedPlayIds, updatedTagCount, showConfirmation);

            playlistEventEmitter.emit(CUSTOM_TAGS_EVENTS.SAVE, customTagsEvent);
        }
    };
}

export default CustomTagPillsController;
