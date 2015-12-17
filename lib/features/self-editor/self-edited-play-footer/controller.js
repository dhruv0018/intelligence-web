SelfEditedPlayFooterController.$inject = [
    '$scope',
    'SelfEditedPlaysFactory',
    'CustomtagsFactory',
    'PlaylistEventEmitter',
    'CUSTOM_TAGS_EVENTS'
];

function SelfEditedPlayFooterController (
    $scope,
    selfEditedPlays,
    customtags,
    playlistEventEmitter,
    CUSTOM_TAGS_EVENTS
) {

    $scope.customTags = customtags.getList($scope.play.customTagIds);

    // Update play if custom tags are updated.
    playlistEventEmitter.on(CUSTOM_TAGS_EVENTS.SAVE, customTagsEvent => {
        if (customTagsEvent.updatedPlayIds.indexOf($scope.play.id) !== -1) {
            $scope.play = selfEditedPlays.get($scope.play.id);
            $scope.customTags = customtags.getList($scope.play.customTagIds);
        }
    });

}

export default SelfEditedPlayFooterController;
