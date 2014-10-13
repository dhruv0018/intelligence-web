/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * State Selector
 * @module State Selector
 */
var StateSelector = angular.module('stateSelector', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
StateSelector.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('state-selector.html', template);
    }
]);

/**
 * State Selector directive.
 * @module State Selector
 * @name State Selector
 * @type {Directive}
 */
StateSelector.directive('stateSelector', [
    function directive() {

        var stateSelector = {

            restrict: TO += ELEMENTS,

            templateUrl: 'state-selector.html',

            scope: {
                stateOptions: '='
            },

            controller: 'stateSelector.controller'
        };

        return stateSelector;
    }
]);

/**
 * State Selector controller
*/
StateSelector.controller('stateSelector.controller', [
    '$scope', '$state',
    function controller($scope, $state) {

        //view selector
        $scope.$watch('stateSelected', function(stateSelected) {
            $state.go(stateSelected.state);
        });
    }
]);
