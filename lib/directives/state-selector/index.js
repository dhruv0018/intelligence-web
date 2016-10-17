/* Constants */
let TO = '';
const ELEMENTS = 'E';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * State Selector
 * @module State Selector
 */
const StateSelector = angular.module('stateSelector', [
    'ui.router',
    'ui.bootstrap'
]);

/**
 * State Selector directive.
 * @module State Selector
 * @name State Selector
 * @type {Directive}
 */
StateSelector.directive('stateSelector', [
    function directive() {

        const stateSelector = {

            restrict: TO += ELEMENTS,

            templateUrl: 'lib/directives/state-selector/template.html',

            scope: {
                stateOptions: '=',
                statesAsTabs: '='
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
    '$scope', '$state', 'AuthorizationService', 'STATE_NAMES', 'SPORTS',
    function controller($scope, $state, authz, STATE_NAMES, SPORTS) {
        $scope.STATE_NAMES = STATE_NAMES;
        $scope.stateSelected = null;
        $scope.showDropdown = false;
        $scope.isInitialState = true;

        //a list of the indices of authorized states
        var authorizedStates = [];

        angular.forEach($scope.stateOptions, function(stateOption, index) {
            //show Reports dropdown if football
            if (stateOption.name === 'Games.Formations') {
                $scope.showDropdown = true;
            }

            if (authz.isAuthorized(stateOption)) {
                authorizedStates.push(stateOption);
            }

            if ($state.current.name === stateOption.name) {
                $scope.isInitialState = false;
                $scope.stateSelected = stateOption;
            }

        });

        //if no initial state is found set it to the first authorized state
        if (!$scope.stateSelected && (authorizedStates.length !== 0)) {
            $scope.stateSelected = authorizedStates[0];
        }

        //update active tab when you click the back or forward button
        $scope.$on('$locationChangeStart', function(event, next, current) {
            $scope.stateOptions.map(function(obj) {
                if(obj.name.toLowerCase().indexOf(next.split('/').pop().replace('-','').substr(0,4)) > -1){
                    $scope.stateSelected = obj;
                }
            });
        });

        //view selector
        $scope.$watch('stateSelected', function(stateSelected) {
            if ($scope.stateSelected) {
                var stateOptions = {};
                if ($scope.isInitialState) {
                    stateOptions.location = 'replace';
                    $scope.isInitialState = false;
                }
                $state.go(stateSelected.name, {}, stateOptions);
            }
        });

        //select state function when using tabs
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

export default StateSelector;
