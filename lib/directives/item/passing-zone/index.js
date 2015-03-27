/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'item/passing-zone.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * PassingZone
 * @module PassingZone
 */
var PassingZone = angular.module('Item.PassingZone', []);

/* Cache the template file */
PassingZone.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * PassingZone directive.
 * @module PassingZone
 * @name PassingZone
 * @type {Directive}
 */
PassingZone.directive('krossoverItemPassingZone', [
    'ROLES', 'ZONES', 'ZONE_IDS', 'SessionService',
    function directive(ROLES, ZONES, ZONE_IDS, session) {

        var PassingZone = {

            restrict: TO += ELEMENTS,

            replace: true,

            scope: {
                item: '=',
                event: '=',
                autoAdvance: '=?',
                isEditable: '=?'
            },

            link: link,

            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

            $scope.isEditable = angular.isDefined($scope.isEditable) ? $scope.isEditable : true;

            var currentUser = session.currentUser;

            $scope.isCoach = currentUser.is(ROLES.COACH);
            $scope.isIndexer = currentUser.is(ROLES.INDEXER);

            $scope.ZONES = ZONES;
            $scope.ZONE_IDS = ZONE_IDS;
            $scope.isReset = false;

            $scope.isUndefined = function(item) {

                return angular.isUndefined(item);
            };

            $scope.onChange = function() {
                if ($scope.autoAdvance === true) {
                    $scope.event.activeEventVariableIndex = $scope.item.index + 1;
                }
            };

            $scope.onBlur = function() {
                $scope.isReset = false;
                if (!$scope.event.variableValues[$scope.item.id].value) {
                    if ($scope.item.isRequired) {
                        $scope.event.variableValues[$scope.item.id].value = $scope.previousValue;
                    } else {
                        $scope.event.variableValues[$scope.item.id].value = null;
                    }
                }
            };

            $scope.shouldFocus = function() {
                if ($scope.autoAdvance === true) {
                    return $scope.event.activeEventVariableIndex == $scope.item.index;
                } else {
                    return $scope.isReset;
                }
            };

            $scope.reset = function() {
                if ($scope.autoAdvance === true) {
                    $scope.event.activeEventVariableIndex = $scope.item.index;
                } else {
                    $scope.event.activeEventVariableIndex = 0;
                }
                $scope.previousValue = $scope.event.variableValues[$scope.item.id].value === null ? undefined : $scope.event.variableValues[$scope.item.id].value;
                $scope.event.variableValues[$scope.item.id].value = undefined;
                $scope.isReset = true;
            };
        }

        return PassingZone;
    }
]);
