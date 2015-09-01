/* Fetch Mousetrap from the browser scope */
const Mousetrap = window.Mousetrap;

/**
 * IndexerFields.Link
 * @module IndexerFields
 * @name IndexerFields.Link
 * @type {Function}
 */

function IndexerFieldsLink ($scope, element, attributes) {

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

    if (!$scope.event.isValid) {

        autoFocusFirstFieldElement(timeoutFrequency);
    }
}

export default IndexerFieldsLink;
