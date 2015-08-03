/* Constants */
let TO = '';
let ATTRIBUTES = 'A';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Fit Element
 * @module Formation Chart
 */
let FitElement = angular.module('FitElement', []);

FitElementDirective.$inject = [
    '$interval',
    '$window',
    '$document'
];

function FitElementDirective(
    $interval,
    $window,
    $document
) {

    let fitElement = {

        restrict: TO += ATTRIBUTES,
        link: fitElementLink,

    };


    function fitElementLink(scope, element) {

        let elementAspectRatio;
        let intervalId;
        let boundFit;

        /* Wait for document to be ready so that the element has a size */
        $document.ready(() => {

            let elementClientRect = element[0].getBoundingClientRect();

            elementAspectRatio = elementClientRect.width / elementClientRect.height;

            /* Listen for resize and fit element */
            boundFit = fit.bind(this, element, elementAspectRatio);
            $window.addEventListener('resize', boundFit);

            let newRect;
            intervalId = $interval(() => {

                newRect = element[0].getBoundingClientRect();

                if (newRect.top !== elementClientRect.top ||
                    newRect.left !== elementClientRect.left ||
                    newRect.right !== elementClientRect.right ||
                    newRect.bottom !== elementClientRect.bottom
                ) {

                    elementClientRect = newRect;
                    fit(element, elementAspectRatio);
                }
            }, 32, false);

            fit(element, elementAspectRatio);

            /* Destroy Cleanup */

            element.on('$destroy', onDestroy);
        });

        function onDestroy() {

            $window.removeEventListener('resize', boundFit);
            clearInterval(intervalId);
        }

    }

    function fit(element, elementAspectRatio) {

        if (!element || !elementAspectRatio) return;

        let parentClientRect = getParentSize(element[0]);

        if (!parentClientRect) return;

        // 1) The element should always remain entirely within the window
        // 2) The element should be as wide as possible
        // 3) The element should have it's original aspect ratio
        // 4) The element should be contained within its parent's container

        // Set the width to the parent container width
        let fittedWidth = parentClientRect.width;

        // Get height with proper aspect-ratio
        let fittedHeight = fittedWidth * (1 / elementAspectRatio);

        // Get the parent's height and width
        let parentHeight = parentClientRect.height;
        let parentWidth = parentClientRect.width;

        /* Check if the height is within the parent container */
        if (fittedHeight > parentHeight) {

            // Reset the properHeight and proper Width to fit within the parent
            fittedHeight = parentHeight;
            fittedWidth = fittedHeight * elementAspectRatio;
        }

        let projectedElementBottom = element[0].getBoundingClientRect().top + fittedHeight;

        /* Check if the projected bottom is beyond the window */
        if (projectedElementBottom > window.innerHeight) {

            fittedHeight -= projectedElementBottom - window.innerHeight;
            fittedWidth = fittedHeight * elementAspectRatio;
        }

        element.css({
            'width': fittedWidth + 'px',
            'height': fittedHeight + 'px'
        });
    }

    /**
     * Returns the bounding client rect of a parent if it has a height
     * @param {domElement} element
     */
    function getParentSize(element) {

        if (!element) return null;

        let parent = element.parentElement;

        if (!parent || !parent.getBoundingClientRect) return null;

        let parentClientRect = parent.getBoundingClientRect();

        if (parentClientRect.height) {

            return parentClientRect;

        } else {

            return getParentSize(parent);
        }
    }


    return fitElement;
}

FitElement.directive('fitElement', FitElementDirective);
