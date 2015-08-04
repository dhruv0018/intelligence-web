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

        const currentFieldElement = $scope.elementsManager.current;
        const activeElement = document.activeElement;

        if (activeElement === currentFieldElement) {

            $scope.elementsManager.backward($scope.onBackward);
        }
        else
        {
            currentFieldElement.focus();
        }
    }

    function onEnter (event) {

        const currentFieldElement = $scope.elementsManager.current;
        const nextBtnElement = document.getElementById('indexing-btn-next');
        const saveBtnElement = document.getElementById('indexing-btn-save');
        let elements = [
            currentFieldElement,
            nextBtnElement,
            saveBtnElement
        ];
        const activeElement = document.activeElement;

        if (elements.some(element => activeElement === element)) {

            $scope.elementsManager.forward();
        }
        else
        {
            currentFieldElement.focus();
        }
    }

    function onDestroy () {

        uiEventEmitter.removeListener(EVENT.UI.KEY_DOWN.ESC, onEsc);
        uiEventEmitter.removeListener(EVENT.UI.KEY_DOWN.ENTER, onEnter);
    }
}

export default IndexerScriptController;
