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
    '$scope', '$state', '$modalInstance', 'GamesFactory', 'UsersFactory', 'AlertsService', 'Assistant', 'ResourceManager', 'SessionService', 'ROLE_TYPE',
    function controller($scope, $state, $modalInstance, games, users, alerts, assistant, resourceManager, session, ROLE_TYPE) {
        $scope.keys = window.Object.keys;

        $scope.assistant = assistant;
        $scope.users = users.getCollection();

        var backup = angular.copy($scope.assistant);

        $scope.cancel = function() {

            $modalInstance.close();
        };

        angular.forEach($scope.assistant.roles, function(role) {
            if (role.teamId === session.currentUser.currentRole.teamId && role.type.id === ROLE_TYPE.ASSISTANT_COACH) {
                $scope.assistantCoachRole = role;
            }
        });

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

        $modalInstance.result.catch(function() {
            angular.extend($scope.assistant, $scope.assistant, backup);

            if (!$scope.assistant.id) {
                $scope.assistantCoaches.pop();
            }

        });
    }
]);


