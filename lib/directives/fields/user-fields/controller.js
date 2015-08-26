UserFieldsController.$inject = [
    '$scope',
    'UIEventEmitter',
    'PlaylistEventEmitter',
    'EVENT'
];

function UserFieldsController (
    $scope,
    uiEventEmitter,
    playlistEventEmitter,
    EVENT
) {

    // Add keybinding handlers for ENTER, ESC
    uiEventEmitter.on(EVENT.UI.KEY_DOWN.ESC, onEsc);
    uiEventEmitter.on(EVENT.UI.KEY_DOWN.ENTER, onEnter);
    $scope.$on('$destroy', onDestroy);

    function onEsc (event) {

        document.activeElement.blur();

        playlistEventEmitter.emit(EVENT.PLAYLIST.EVENT.CANCEL_EDITING, $scope.event);
    }

    function onEnter (event) {

        document.activeElement.blur();

        /**
         * TODO: Emit separate events for confirm editing and value change
         * This event has a handler in the event that recompiles the template
         * and another in the play that saves the play resource. We should
         * only save the play when the fields' values change
         */
        playlistEventEmitter.emit(EVENT.PLAYLIST.EVENT.CONFIRM_EDITING, $scope.event);
    }

    function onDestroy () {

        uiEventEmitter.removeListener(EVENT.UI.KEY_DOWN.ESC, onEsc);
        uiEventEmitter.removeListener(EVENT.UI.KEY_DOWN.ENTER, onEnter);
    }
}

export default UserFieldsController;
