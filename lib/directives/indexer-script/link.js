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

    const onEsc = () => {

        const previousElement = elements.manager.previous();

        if (previousElement) {

            previousElement.focus();
        }
        else {

            elements.manager.current.blur();
        }
    };

    const onEnter = () => {

        const nextElement = elements.manager.next();

        if (nextElement) {

            nextElement.focus();
        }
        else {

            elements.manager.current.blur();
        }
    };

    Mousetrap.bind('esc', onEsc, 'keypress');
    Mousetrap.bind('enter', onEnter, 'keypress');

    elementsManager.first.focus();
}

export default IndexerScriptLink;
