/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;
import filmHeaderController from './controller.js';
/**
 * Film Header
 * @module Film Header
 */
var filmHeader = angular.module('film-header', []);

/**
 * Film Header directive.
 * @module Film Header
 * @name Film Header
 * @type {Directive}
 */
filmHeader.directive('filmHeader', [
    function directive() {

        var filmHeader = {

            restrict: TO += ELEMENTS,

            scope: {
                'play': '=?',
                'film': '=',
                'gameStates': '=?',
                'isEditable': '=?',
                'gameForReel': '=?'
            },

            templateUrl: 'lib/directives/film-header/template.html',

            controller: filmHeaderController
        };

        return filmHeader;
    }
]);

export default filmHeader;
