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

    // Bind controller methods to $scope
    $scope.type = type;
    $scope.isString = isString;

    // Add keybinding handlers for ENTER, ESC
    uiEventEmitter.on(EVENT.UI.KEY_DOWN.ESC, onEsc);
    uiEventEmitter.on(EVENT.UI.KEY_DOWN.ENTER, onEnter);

    $scope.$watch('event', onEventChange, true);

    // Bind elementsManager to controller (used in link)
    let elementsManager = new FieldsElementsManagerService($scope.event.fields);
    this.elementsManager = elementsManager;

    function onEventChange (oldValue, newValue) {

        playlistEventEmitter.emit(
            EVENT.PLAYLIST.EVENT.CURRENT_CHANGE,
            $scope.event
        );
    }

    function onEsc (event) {

        elementsManager.backward($scope.onBackward);
    }

    function onEnter (event) {

        elementsManager.forward();
    }

    // TODO: Remove when properly able to identify fields in template
    function type (obj) {

        return typeof obj;
    }

    // TODO: Remove when properly able to identify fields in template
    function isString (obj) {

        return type(obj) === 'string';
    }
}

export default IndexerScriptController;
