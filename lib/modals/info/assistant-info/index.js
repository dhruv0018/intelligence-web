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

        $scope.EMAIL_REQUEST_TYPES = EMAIL_REQUEST_TYPES;
        $scope.keys = window.Object.keys;
        $scope.assistant = assistant;
        $scope.users = users.getCollection();
        $scope.team = teams.get(session.currentUser.currentRole.teamId);
        $scope.assistantCoachRole = $scope.assistant.getRoles(ROLE_TYPE.ASSISTANT_COACH, null).filter(function(role) {
            return role.teamId === session.currentUser.currentRole.teamId;
        })[0];

        var backup = angular.copy($scope.assistant);

        $scope.saveAssistant = function() {
            if ($scope.assistantForm.$valid) {
                $scope.assistant.save();
                $modalInstance.close();
            }
        };

        $scope.toggleAssistant = function() {
            $scope.assistantCoachRole.tenureEnd = ($scope.assistantCoachRole.tenureEnd) ? null : moment.utc().toDate();
            $scope.assistant.save();
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
            angular.extend($scope.assistant, $scope.assistant, backup);

            if (!$scope.assistant.id) {
                $scope.assistantCoaches.pop();
            }

        });
    }
]);
