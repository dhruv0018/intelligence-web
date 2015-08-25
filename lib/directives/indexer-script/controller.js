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
    $scope.$on('$destroy', onDestroy);

    // Instantiate elementsManager
    let elementsManager = new FieldsElementsManagerService($scope.event.fields);

    $scope.onFieldClick = onFieldClick;
    $scope.autofocusField = autofocusField;

    function onEventComplete () {
        playlistEventEmitter.emit(EVENT.INDEXING.EVENT.COMPLETE, $scope.event);
    }

    function onEsc (event) {

        const currentFieldElement = elementsManager.current;
        const activeElement = document.activeElement;

        if (activeElement === currentFieldElement) {

            elementsManager.backward($scope.onBackward);
        }
        else
        {
            currentFieldElement.focus();
        }
    }

    function onEnter (event) {

        const currentFieldElement = elementsManager.current;
        const nextBtnElement = document.getElementById('indexing-btn-next');
        const saveBtnElement = document.getElementById('indexing-btn-save');
        let elements = [
            currentFieldElement,
            nextBtnElement,
            saveBtnElement
        ];
        const activeElement = document.activeElement;

        if (elements.some(element => activeElement === element)) {

            elementsManager.forward();
        }
        else
        {
            currentFieldElement.focus();
        }
    }

    function onDestroy () {
        //send a render event out when the event is valid
        onEventComplete();
        uiEventEmitter.removeListener(EVENT.UI.KEY_DOWN.ESC, onEsc);
        uiEventEmitter.removeListener(EVENT.UI.KEY_DOWN.ENTER, onEnter);
    }

    function onFieldClick (field) {

        elementsManager.setCurrentField(field);
    }

    function autofocusField (field) {

        const fieldIsFirst = field.index === elementsManager.fieldsIndices[0];

        return fieldIsFirst && !$scope.event.isValid;
    }
}

export default IndexerScriptController;
