/* Constants */
let TO = '';
const ATTRIBUTES = 'A';

/* Fetch angular from the browser scope */
let angular = window.angular;

/**
 * ButtonBlur module.
 * @module ButtonBlur
 */
let ButtonBlur = angular.module('ButtonBlur', []);

/**
 * ButtonBlur dependencies.
 */
buttonBlur.$inject = [
];

/**
 * ButtonBlur directive.
 * @module ButtonBlur
 * @name ButtonBlur
 * @type {directive}
 */
function buttonBlur () {

    let button;

    const definition = {

        restrict: TO += ATTRIBUTES,
        link
    };

    /**
     * Linking function
     *
     * @function link
     * @param {object} scope
     * @param {object} element
     */
    function link (scope, element) {

        button = element[0];
        button.addEventListener('click', onClick);
        element.on('$destroy', onDestroy);

        /**
         * Blurs the direcive and any child elements
         *
         * @function onClick
         */
        function onClick () {

            this.blur();
            angular.forEach(element.children(), child => child.blur());
        }

        /**
         * Cleans up click handlers
         *
         * @function onDestroy
         */
        function onDestroy () {

            button.removeEventListener('click', onClick);
        }
    }

    return definition;
}

ButtonBlur.directive('buttonBlur', buttonBlur);
