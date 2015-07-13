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
    '$window',
    '$document'
];

function FitElementDirective(
    $window,
    $document
) {

    let fitElement = {

        restrict: TO += ATTRIBUTES,
        link: fitElementLink,

    };


    function fitElementLink($scope, $element, $attributes) {

        let elementAspectRatio;

        /* Wait for document to be ready so that the element has a size */
        $document.ready(() => {

            let elementClientRect = $element[0].getBoundingClientRect();

            elementAspectRatio = elementClientRect.width / elementClientRect.height;

            /* Listen for resize and fit element */
            let boundFit = fit.bind(this, $element, elementAspectRatio);
            $window.addEventListener('resize', boundFit);

            let removeElementRectWatch = $scope.$watch(
                (scope) => {

                    let newRect = $element[0].getBoundingClientRect();

                    if (newRect.top !== elementClientRect.top ||
                        newRect.left !== elementClientRect.left ||
                        newRect.right !== elementClientRect.right ||
                        newRect.bottom !== elementClientRect.bottom
                    ) {

                        elementClientRect = newRect;
                        return elementClientRect;
                    }
            }, (newRect, oldRect) => {

                fit($element, elementAspectRatio);
            });

            fit($element, elementAspectRatio);

            /* Destroy Cleanup */

            $element.on('$destroy', function onDestroy() {

                $window.removeEventListener('resize', boundFit);
                removeElementRectWatch();
            });
        });

    }

    function fit($element, elementAspectRatio) {

        if (!$element || !elementAspectRatio) return;

        let parentWithHeight = getJQLiteParentWithHeight($element);

        if (!parentWithHeight) return;

        // 1) The element should always remain entirely within the window
        // 2) The element should be as wide as possible
        // 3) The element should have it's original aspect ratio
        // 4) The element should be contained within its parent's container

        // Get a parent that does not have a significantly small height
        let parentWithHeightRect = parentWithHeight[0].getBoundingClientRect();

        // Set the width to the parent container width
        let fittedWidth = parentWithHeightRect.width;

        // Get height with proper aspect-ratio
        let fittedHeight = fittedWidth * (1 / elementAspectRatio);

        // Get the parent's height and width
        let parentHeight = parentWithHeightRect.height;
        let parentWidth = parentWithHeightRect.width;

        /* Check if the height is within the parent container */
        if (fittedHeight > parentHeight) {

            // Reset the properHeight and proper Width to fit within the parent
            fittedHeight = parentHeight;
            fittedWidth = fittedHeight * elementAspectRatio;
        }

        let projectedElementBottom = $element[0].getBoundingClientRect().top + fittedHeight;

        /* Check if the projected bottom is beyond the window */
        if (projectedElementBottom > window.innerHeight) {

            fittedHeight -= projectedElementBottom - window.innerHeight;
            fittedWidth = fittedHeight * elementAspectRatio;
        }

        $element.css({
            'width': fittedWidth + 'px',
            'height': fittedHeight + 'px'
        });
    }

    function getJQLiteParentWithHeight($element) {

        if (!$element) return null;

        let $parent = $element.parent();

        if (!$parent || !$parent[0] || !$parent[0].getBoundingClientRect) return null;

        let height = $parent[0].getBoundingClientRect().height;

        if (height) {

            return $parent;

        } else {

            return getJQLiteParentWithHeight($parent);
        }
    }


    return fitElement;
}

FitElement.directive('fitElement', FitElementDirective);
