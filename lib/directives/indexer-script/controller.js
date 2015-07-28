/* Module Imports */
import FieldsElementsManagerService from './field-manager';

/**
 * IndexerScript.Controller
 * @module IndexerScript
 * @name IndexerScript.Controller
 * @type {Controller}
 */
class IndexerScriptController {

    constructor (
        $scope,
        uiEventEmitter,
        EVENT
    ) {

        // Bind controller methods to $scope
        $scope.type = this.type;
        $scope.isString = this.isString;

        // Bind elementsManager to controller (used in link)
        this.elementsManager = new FieldsElementsManagerService($scope.event.fields);

        // Add keybinding handlers for ENTER, ESC
        uiEventEmitter.on(EVENT.UI.KEY_DOWN.ENTER, () => this.elementsManager.forward($scope.onForward));
        uiEventEmitter.on(EVENT.UI.KEY_DOWN.ESC, () => this.elementsManager.backward($scope.onBackward));
    }

    type (obj) {

        return typeof obj;
    }

    isString (obj) {

        return this.type(obj) === 'string';
    }
}

/**
* IndexerScript.Controller dependencies
*/
IndexerScriptController.$inject = [
    '$scope',
    'UIEventEmitter',
    'EVENT'
];

export default IndexerScriptController;
