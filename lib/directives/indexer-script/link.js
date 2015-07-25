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

    /**
     * FIXME:
     * Problem: Angular compiles the directive and invokes
     * the post link before the template is loaded.
     * DOMContentLoaded event listener implementation was
     * unsuccessful.
     * This is dirty but I have to auto-focus/click
     * the first element somehow.
     */
    function clickFirstFieldElement (delay) {

        const firstFieldElement = elementsManager.first;

        if (firstFieldElement === null) {

            window.setTimeout(() => clickFirstFieldElement(delay), delay);
        }
        else {

            firstFieldElement.click();
        }
    }

    Mousetrap.bind('esc', onEsc);
    Mousetrap.bind('enter', onEnter);

    const timeoutFrequency = 1; // milliseconds
    clickFirstFieldElement(timeoutFrequency);
}

export default IndexerScriptLink;
