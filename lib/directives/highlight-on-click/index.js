/* Constants */
const restrict = 'A';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * HighlightOnClick
 * @module HighlightOnClick
 */
const HighlightOnClick = angular.module('HighlightOnClick', []);

/**
 * HighlightOnClick Directive
 * @module HighlightOnClick
 * @name HighlightOnClick
 * @type {directive}
 */
HighlightOnClick.directive('highlightOnClick', highlightOnClickDirective);

highlightOnClickDirective.$inject = ['$window'];


function highlightOnClickDirective($window) {

    const highlightOnClick = {
        restrict,
        link: function (scope, element) {
            // Highlight element content on click
            element.on('click', function () {
                if (!$window.getSelection().toString()) {
                    let range = document.createRange();
                    range.selectNode(this);
                    $window.getSelection().addRange(range);
                }
            });
        }
    };

    return highlightOnClick;
}

export default HighlightOnClick;
