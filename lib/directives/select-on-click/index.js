/* Constants */
const restrict = 'A';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * SelectOnClick
 * @module SelectOnClick
 */
const SelectOnClick = angular.module('SelectOnClick', []);

/**
 * SelectOnClick Directive
 * @module SelectOnClick
 * @name SelectOnClick
 * @type {directive}
 */
SelectOnClick.directive('selectOnClick', [
    '$window',
    function directive($window) {

        const selectOnClick = {
            restrict,
            link: function (scope, element, attrs) {
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

        return selectOnClick;
    }
]);

export default SelectOnClick;
