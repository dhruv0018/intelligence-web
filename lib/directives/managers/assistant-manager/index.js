/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * AssistantManager
 * @module roster-manager
 */
var AssistantManager = angular.module('assistant-manager', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
AssistantManager.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('assistant-manager.html', require('./template.html'));
    }
]);

/**
 * AssistantManager directive.
 * @module AssistantManager
 * @name AssistantManager
 * @type {Directive}
 */
AssistantManager.directive('assistantManager', [
    'ROLES', 'UsersFactory', 'AssistantInfo.Modal',
    function directive(ROLES, users, AssistantInfo) {

        var assistantManager = {

            restrict: TO += ELEMENTS,
            templateUrl: 'assistant-manager.html',
            replace: true,
            scope: {
                team: '='
            },
            link: function(scope, element, attributes) {
                scope.options = {
                    scope: scope
                };
                scope.ROLES = ROLES;

                scope.assistantCoaches = [];

                scope.addNewAssistantCoach = function() {
                    var assistantCoach = users.create();
                    assistantCoach.addRole(assistantCoach, scope.ROLES.ASSISTANT_COACH, scope.team);

                    var options = {
                        scope: scope,
                        targetAssistant: assistantCoach
                    };

                    AssistantInfo.open(options);
                };
//                scope.$watch('filtering', function(filtering) {
//                    if (typeof filtering !== 'undefined') {
//
//                        if (filtering === 'inactive') {
//                            scope.filterType = scope.isInactive;
//                        } else if (filtering === 'active') {
//                            scope.filterType = scope.isActive;
//                        } else if (filtering === 'none') {
//                            scope.filterType = {};
//                        }
//                    }
//                });

//                scope.isActive = function(player) {
//                    return player.rosterStatuses[scope.rosterId] !== false;
//                };
//
//                scope.isInactive = function(player) {
//                    return player.rosterStatuses[scope.rosterId] === false;
//                };

            }

        };

        return assistantManager;
    }
]);
