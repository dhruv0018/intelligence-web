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
                        User: function() {
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
    '$scope', '$state', '$timeout', '$modalInstance', 'GamesFactory', 'UsersFactory', 'TeamsFactory', 'AlertsService', 'User', 'SessionService', 'ROLE_TYPE', 'ROLES', 'EMAIL_REQUEST_TYPES',
    function controller($scope, $state, $timeout, $modalInstance, games, users, teams, alerts, user, session, ROLE_TYPE, ROLES, EMAIL_REQUEST_TYPES) {

        // Either an existing user is passed in, or we create a new one
        $scope.user = user ? user : users.create();
        // Get assistantCoachRole for user if they have a
        $scope.assistantCoachRoleForTeam = $scope.user ? $scope.user.getUserRoleForTeam(ROLES.ASSISTANT_COACH, $scope.team): null;

        $scope.EMAIL_REQUEST_TYPES = EMAIL_REQUEST_TYPES;
        $scope.keys = window.Object.keys;
        $scope.users = users.getCollection();
        $scope.team = teams.get(session.currentUser.currentRole.teamId);

        var backup = angular.copy($scope.user);

        $scope.save = function() {

            if (!$scope.assistantForm.$valid) return;

            // TODO: Add 'exists()' function to users factory
            // does the assistant coach exist yet?

            getUserByEmail($scope.user.email)
            .then(user => {
                // User Exists, if we are adding a assistant coach role, use the existing user in the system
                if (user) {
                    /**
                     * DO WE NEED THIS STILL?
                      // existingUser = users.get($scope.user.id);
                      // angular.extend(existingUser, $scope.user);
                      */
                    addRoleToUser(user)
                    .then(function addRoleToTeam(role) {

                        addAssistantCoachRoleToTeam(user);

                        // new role was added to existing user
                        if (role) $modalInstance.close(user);
                        // role already exists on the user
                        else $modalInstance.close();
                    });
                    // NOTE: Don't wait for update to finish before closing since
                    // the template doesn't handle a 'saving' state yet.
                    $modalInstance.close();

                } else {

                    // add new assistant coach
                    addRoleToUser($scope.user)
                    .then(function addRoleToTeam() {
                        addAssistantCoachRoleToTeam($scope.user);
                    });
                    // Wait for a newUser before closing the modal
                    $modalInstance.close($scope.user);
                }
            });

        };


        function addAssistantCoachRoleToTeam(user) {

            $scope.team.addRole(user, ROLES.ASSISTANT_COACH);

            return $scope.team.save();
        }

        /**
         * @method getUserByEmail
         * @description Gets a user resource by email if found and return null if not found
         * @param {string} email
         * @returns {object|null}
         */
        function getUserByEmail(email) {

            if (!email) return null;

            // Does the assistant coach already exist in the system?
            let fetchUserByEmail = users.fetch(email);

            return fetchUserByEmail
            .then(
                function userFound(responseUser) {
                    return responseUser;
                },
                function noUserFound() {
                    return null;
                }
            );

        }

        function addRoleToUser(user) {

            let role = user.addRole(ROLES.ASSISTANT_COACH, $scope.team);

            return user.save()
                .then(function userSaved() {
                    // User successfully saved with role
                    return role;
                });
        }

        $scope.activateDeactivateRole = function() {

            let assistantCoachRoleForTeam = $scope.user.getUserRoleForTeam(ROLES.ASSISTANT_COACH, $scope.team);

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

        $modalInstance.result.catch(function() {
            angular.extend($scope.user, $scope.user, backup);

            if (!$scope.user.id) {
                $scope.assistantCoaches.pop();
            }

        });
    }
]);
