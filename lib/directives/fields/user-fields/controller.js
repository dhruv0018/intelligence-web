UserFieldsController.$inject = [
    '$scope',
    'UIEventEmitter',
    'EVENT'
];

function UserFieldsController (
    $scope,
    uiEventEmitter,
    EVENT
) {

    // Add keybinding handlers for ENTER, ESC
    uiEventEmitter.on(EVENT.UI.KEY_DOWN.ESC, onEsc);
    uiEventEmitter.on(EVENT.UI.KEY_DOWN.ENTER, onEnter);
    $scope.$on('$destroy', onDestroy);

    function onEsc (event) {

        document.activeElement.blur();
    }

    function onEnter (event) {

        document.activeElement.blur();
    }

    function onDestroy () {

        uiEventEmitter.removeListener(EVENT.UI.KEY_DOWN.ESC, onEsc);
        uiEventEmitter.removeListener(EVENT.UI.KEY_DOWN.ENTER, onEnter);
    }
}

export default UserFieldsController;
