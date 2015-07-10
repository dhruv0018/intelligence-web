//import link from './link.js';
//import PlayerDropdownComponent from './player-dropdown/index.js';
import controller from './controller.js';

/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'field/template.html';

/* Component resources */
import template from './template.html.js';
import dropdownTemplate from './dropdown-input.html.js';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Field
 * @module Field
 */
var Field = angular.module('Field', [
    //'Field.PlayerDropdown',
    'ui.router',
    'ui.bootstrap'
]);

Field.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
        $templateCache.put('field/dropdown-input.html', dropdownTemplate);
    }
]);

/**
 * Field directive.
 * @module Field
 * @name Field
 * @type {Directive}
 */
Field.directive('krossoverField', [
    function directive() {
        var Field = {

            restrict: 'E',
            scope: {
                field: '=',
                event: '='
            },
            // link: {
            //     post: link
            // },
            link: function(scope, element, attrs) {
                element.bind('click', ()=> {
                    element.find('input')[0].focus();
                });
            },
            controller,
            templateUrl: templateUrl
        };

        return Field;
    }
]);

export default Field;
