/* Module Imports */
import FieldsElementsManagerService from './field-manager';

/**
* IndexerScript.Controller dependencies
*/
IndexerScriptController.$inject = [
    '$scope',
    'UIEventEmitter',
    'EVENT',
    'PlaylistEventEmitter'
];

/**
 * IndexerScript.Controller
 * @module IndexerScript
 * @name IndexerScript.Controller
 * @type {Controller}
 */
function IndexerScriptController (
    $scope,
    uiEventEmitter,
    EVENT,
    playlistEventEmitter
) {

    // Add keybinding handlers for ENTER, ESC
    uiEventEmitter.on(EVENT.UI.KEY_DOWN.ESC, onEsc);
    uiEventEmitter.on(EVENT.UI.KEY_DOWN.ENTER, onEnter);

    $scope.$watch('event', onEventChange, true);
    $scope.$on('$destroy', onDestroy);

    // Bind elementsManager to controller (used in link)
    $scope.elementsManager = new FieldsElementsManagerService($scope.event.fields);

    function onEventChange (oldValue, newValue) {

        playlistEventEmitter.emit(
            EVENT.PLAYLIST.EVENT.CURRENT_CHANGE,
            $scope.event
        );
    }

    function onEsc (event) {

        $scope.elementsManager.backward($scope.onBackward);
    }

    function onEnter (event) {

        $scope.elementsManager.forward();
    }

    function onDestroy () {

        uiEventEmitter.removeListener(EVENT.UI.KEY_DOWN.ESC, onEsc);
        uiEventEmitter.removeListener(EVENT.UI.KEY_DOWN.ENTER, onEnter);
    }
}

export default IndexerScriptController;
