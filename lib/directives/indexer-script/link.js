/* Fetch Mousetrap from the browser scope */
const Mousetrap = window.Mousetrap;

/**
 * IndexerScript.Link
 * @module IndexerScript
 * @name IndexerScript.Link
 * @type {Function}
 */

function IndexerScriptLink ($scope, element, attributes) {

    /**
     * FIXME:
     * Problem: Angular compiles the directive and invokes
     * the post link before the template is loaded.
     * DOMContentLoaded event listener implementation was
     * unsuccessful.
     * This is dirty but I have to auto-focus/click
     * the first element somehow.
     */
    function autoFocusFirstFieldElement (delay) {

        const firstFieldElement = $scope.elementsManager.first;

        if (firstFieldElement === null) {

            window.setTimeout(() =>
                autoFocusFirstFieldElement(delay),
                delay
            );
        } else if (firstFieldElement !== undefined) {

            firstFieldElement.focus();
        }
    }

    const timeoutFrequency = 1; // milliseconds
    autoFocusFirstFieldElement(timeoutFrequency);
}

export default IndexerScriptLink;
