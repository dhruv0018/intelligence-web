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
    'ROLES', 'UsersFactory', 'AssistantInfo.Modal', 'ROLE_TYPE',
    function directive(ROLES, users, AssistantInfo, ROLE_TYPE) {

        var assistantManager = {

            restrict: TO += ELEMENTS,
            templateUrl: 'assistant-manager.html',
            replace: true,
            scope: {
                team: '=',
                assistantCoaches: '=',
                filtering: '='
            },
            link: function(scope, element, attributes) {
                scope.ROLES = ROLES;

                scope.options = {
                    scope: scope
                };

                scope.addNewAssistantCoach = function() {
                    var assistantCoach = users.create();
                    assistantCoach.addRole(assistantCoach, scope.ROLES.ASSISTANT_COACH, scope.team);
                    var options = {
                        scope: scope,
                        targetAssistant: assistantCoach
                    };

                    AssistantInfo.open(options);
                    scope.assistantCoaches.push(assistantCoach);
                };

                scope.$watch('filtering', function(filtering) {

                    if (typeof filtering !== 'undefined') {

                        if (filtering === 'inactive') {
                            scope.filterType = scope.isInactive;
                        } else if (filtering === 'active') {
                            scope.filterType = scope.isActive;
                        } else if (filtering === 'none') {
                            scope.filterType = {};
                        }
                    }
                });

                scope.isActive = function(assistantCoach) {
                    return assistantCoach.roles.some(function(role) {
                        return role.teamId === scope.team.id && role.type.id === ROLE_TYPE.ASSISTANT_COACH && (!role.tenureEnd || role.tenureEnd === null);
                    });
                };

                scope.isInactive = function(assistantCoach) {
                    return !scope.isActive(assistantCoach);
                };

            }

        };

        return assistantManager;
    }
]);
