/* Module Imports */
import FieldsElementsManagerService from './field-manager';

/* Fetch Mousetrap from the browser scope */
const Mousetrap = window.Mousetrap;

/**
 * IndexerScript.Link
 * @module IndexerScript
 * @name IndexerScript.Link
 * @type {Function}
 */

function IndexerScriptLink ($scope, element, attributes) {

    const elementsManager = new FieldsElementsManagerService($scope.event.fields);

    function onEsc () {

        let fallback = $scope.back;
        elementsManager.backward(fallback);
    }

    function onEnter () {

        let fallback = $scope.next;
        elementsManager.forward(fallback);
    }

    Mousetrap.bind('esc', onEsc);
    Mousetrap.bind('enter', onEnter);

    elementsManager.first.click();
}

export default IndexerScriptLink;
