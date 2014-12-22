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
                stateOptions: '=',
                statesAsDropdown: '='
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
    '$scope', '$state', 'AuthorizationService', 'STATE_NAMES',
    function controller($scope, $state, authz, STATE_NAMES) {
        $scope.STATE_NAMES = STATE_NAMES;
        $scope.statesAsDropdown = false;
        $scope.stateSelected = null;

        //a list of the indices of authorized states
        var authorizedStates = [];

        angular.forEach($scope.stateOptions, function(stateOption, index) {
            if (authz.isAuthorized(stateOption)) {
                authorizedStates.push(stateOption);
            }

            if ($state.current.name === stateOption.name) {
                $scope.stateSelected = stateOption;
            }

            //if no initial state is found set it it to the first authorized state
            if (!$scope.stateSelected && index === $scope.stateOptions.length - 1) {
                $scope.stateSelected = authorizedStates[0];
            }
        });

        //view selector
        $scope.$watch('stateSelected', function(stateSelected) {
            console.log(stateSelected);
            if (stateSelected) $state.go(stateSelected.name);
        });

        //select state function for when using tabs
        $scope.selectState = function(state) {
            $scope.stateSelected = state;
        };

    }
]);

StateSelector.filter('onlyAuthorizedStates', [
    'AuthorizationService',
    function(authz) {
        return function(states) {
            return states.filter(function(stateOption) {
                return authz.isAuthorized(stateOption);
            });
        };
    }
]);
