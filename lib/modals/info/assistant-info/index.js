/* Component resources */
var template = require('./template.html');
var moment = require('moment');

/* Fetch angular from the browser scope */
var angular = window.angular;


/**
 * AssistantInfo page module.
 * @module AssistantInfo
 */
var AssistantInfo = angular.module('AssistantInfo', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
AssistantInfo.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('assistant-info.html', template);
    }
]);

/**
 * AssistantInfo Modal
 * @module AssistantInfo
 * @name AssistantInfo.Modal
 * @type {service}
 */
AssistantInfo.value('AssistantInfo.ModalOptions', {

    templateUrl: 'assistant-info.html',
    controller: 'AssistantInfo.controller'
});


/**
 * AssistantInfo modal dialog.
 * @module AssistantInfo
 * @name AssistantInfo.Modal
 * @type {service}
 */
AssistantInfo.service('AssistantInfo.Modal',[
    '$modal', 'AssistantInfo.ModalOptions',
    function($modal, modalOptions) {

        var Modal = {

            open: function(dataOptions) {

                var resolves = {
                    resolve: {
                        Assistant: function() {
                            return dataOptions.targetAssistant;
                        }
                    }
                };

                var options = angular.extend(modalOptions, resolves, dataOptions);
                return $modal.open(options);
            }
        };

        return Modal;
    }
]);

/**
 * AssistantInfo controller.
 * @module AssistantInfo
 * @name AssistantInfo.controller
 * @type {controller}
 */
AssistantInfo.controller('AssistantInfo.controller', [
    '$scope', '$state', '$timeout', '$modalInstance', 'GamesFactory', 'UsersFactory', 'TeamsFactory', 'AlertsService', 'Assistant', 'SessionService', 'ROLE_TYPE', 'ROLES', 'EMAIL_REQUEST_TYPES',
    function controller($scope, $state, $timeout, $modalInstance, games, users, teams, alerts, assistant, session, ROLE_TYPE, ROLES, EMAIL_REQUEST_TYPES) {

        // Either an existing assistant is passed in, or we create a new one
        $scope.user = assistant ? assistant : users.create();

        const ACTIVE_OR_INACTIVE = null;
        $scope.assistantCoachRoleForTeam = $scope.user ? $scope.user.getRoleForTeam(ROLE_TYPE.ASSISTANT_COACH, $scope.team, ACTIVE_OR_INACTIVE): null;

        $scope.EMAIL_REQUEST_TYPES = EMAIL_REQUEST_TYPES;
        $scope.keys = window.Object.keys;
        $scope.users = users.getCollection();
        $scope.team = teams.get(session.currentUser.currentRole.teamId);
        $scope.saving = false;

        var backup = angular.copy($scope.user);

        $scope.save = function() {

            if (!$scope.assistantForm.$valid) return;

            $scope.saving = true;

            // TODO: Add 'exists()' function to users factory
            // does the assistant coach exist yet?

            users.getUserByEmail($scope.user.email)
            .then(user => {

                if (user) {
                    // User Exists, therefore add the assistant coach role to the the returned user
                    let role = user.addRole(ROLES.ASSISTANT_COACH, $scope.team);

                    if (!role) {
                        // user has this role already for the team, therefore no need to save the user
                        $modalInstance.close();

                    } else {
                        // new role has been added to user, now save the user
                        saveUser(user);
                    }

                } else {

                    // User does not exist, add new assistant coach and create new user
                    let role = $scope.user.addRole(ROLES.ASSISTANT_COACH, $scope.team);

                    if (!role) {
                        // something went wrong, a new role should be returned for a new user
                        $modalInstance.close();

                    } else {
                        // new role has been added to user, now save the new user
                        saveUser($scope.user);
                    }
                }
            },
            function() {
                $modalInstance.close();
            });
        };

        function saveUser(user) {
            return user.save()
                .then(
                    userSaveSucceeded,
                    userSaveFailed
                );
        }

        function userSaveSucceeded(user) {

            if (!user) {
                // response error
                $modalInstance.close();
                return;

            } else {

                addAssistantCoachRoleToTeam(user);
                $modalInstance.close(user);
            }
        }

        function userSaveFailed() {
            $modalInstance.close();
        }

        function addAssistantCoachRoleToTeam(user) {

            $scope.team.addRole(user, ROLES.ASSISTANT_COACH);

            return $scope.team.save();
        }

        $scope.activateDeactivateAssistantRole = function(assistantCoachRoleForTeam) {

            // assistant not found on team
            if (!assistantCoachRoleForTeam) return;

            if ($scope.user.isActive(assistantCoachRoleForTeam)) {

                $scope.user.removeRole(assistantCoachRoleForTeam);

            } else {

                // make the inactive coach 'active'
                $scope.user.activateRole(assistantCoachRoleForTeam);
            }

            $scope.user.save();
            $modalInstance.close();
        };

        $scope.resendInvite = function(teamId) {
            $scope.sendingEmail = true;
            $scope.confirmSent = false;
            assistant.resendEmail(EMAIL_REQUEST_TYPES.COACH_ACTIVATION_REMINDER, {teamId: teamId});
            $timeout(function() {
                $scope.confirmSent = true;
            }, 1000);
            $timeout(function() {
                $scope.sendingEmail = false;
            }, 2500);
        };

    }
]);
