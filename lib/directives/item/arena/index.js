/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'item/arena.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Arena
 * @module Arena
 */
var Arena = angular.module('Item.Arena', []);

/* Cache the template file */
Arena.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Arena directive.
 * @module Arena
 * @name Arena
 * @type {Directive}
 */
Arena.directive('krossoverItemArena', ['ROLES', 'SessionService', 'ArenaModal.Modal',

    function directive(ROLES, session, ArenaModal) {

        var Arena = {

            restrict: TO += ELEMENTS,

            scope: {
                item: '=',
                event: '=',
                autoAdvance: '=?'
            },

            link: link,

            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

            var currentUser = session.currentUser;

            $scope.isCoach = currentUser.is(ROLES.COACH);
            $scope.isIndexer = currentUser.is(ROLES.INDEXER);

            $scope.isReset = false;

            $scope.ArenaModal = ArenaModal;

            // Pass parent scope to child modal via modalOptions
            $scope.options = {scope: $scope};

            $scope.coordinates = {};

            $scope.isUndefined = function(item) {
                return angular.isUndefined(item);
            };

            $scope.onBlur = function() {
                $scope.isReset = false;
                if (!$scope.event.variableValues[$scope.item.id].value) {
                    if ($scope.item.isRequired) {
                        $scope.event.variableValues[$scope.item.id].value = $scope.coordinates;
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

            var reset = function() {
                if ($scope.autoAdvance === true) {
                    $scope.event.activeEventVariableIndex = $scope.item.index;
                } else {
                    $scope.event.activeEventVariableIndex = 0;
                }
                $scope.previousValue = $scope.event.variableValues[$scope.item.id].value === null ? undefined : $scope.event.variableValues[$scope.item.id].value;
                $scope.event.variableValues[$scope.item.id].value = undefined;
                $scope.isReset = true;
            };

            $scope.resetAndOpenModal = function() {
                reset();
                ArenaModal.open(options);
            };

            $scope.$watch('event.activeEventVariableIndex', function(ArenaModal) {
                if ($scope.event.activeEventVariableIndex === $scope.item.index) {
                    ArenaModal.close();
                }
            });
        }

        return Arena;
    }
]);

