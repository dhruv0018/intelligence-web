// require('gap');
// require('text');
// require('yard');
// require('arena');
// require('static');
// require('dropdown');
// require('formation');
// require('passing-zone');
// require('team-dropdown');
require('player-dropdown');
// require('team-player-dropdown');
import FieldController from './controller.js';


/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'field/template.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Field
 * @module Field
 */
var Field = angular.module('Field', [
    'Field.PlayerDropdown',
    'ui.router',
    'ui.bootstrap'
]);

Field.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
        $templateCache.put('field/dropdown-input.html', require('./dropdown-input.html'));
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
            link: function(scope, element, attrs) {
                element.bind('click', ()=> {
                    element.find('input')[0].focus();
                });
            },
            templateUrl: templateUrl,
            controller: FieldController
        };

        return Field;
    }
]);
