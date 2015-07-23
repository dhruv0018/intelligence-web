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

        const previousElement = elementsManager.previous();

        if (previousElement) {

            previousElement.click();
        }
        else if (document.activeElement) {

            elementsManager.current.blur();
        }
        else {

            $scope.back();
        }
    }

    function onEnter () {

        const nextElement = elementsManager.next();

        if (nextElement) {

            nextElement.click();
        }
        else {

            elementsManager.current.blur();

            $scope.save();
        }
    }

    Mousetrap.bind('esc', onEsc);
    Mousetrap.bind('enter', onEnter);

    elementsManager.first.click();
}

export default IndexerScriptLink;
