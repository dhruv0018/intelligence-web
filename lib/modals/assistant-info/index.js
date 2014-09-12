/* Component resources */
var template = require('./template.html');

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
    '$scope', '$state', '$modalInstance', 'GamesFactory', 'UsersFactory', 'AlertsService', 'Assistant', 'ResourceManager', 'SessionService',
    function controller($scope, $state, $modalInstance, games, users, alerts, assistant, resourceManager, session) {
        $scope.keys = window.Object.keys;

        $scope.assistant = assistant;
        $scope.users = users.getCollection();

        var backup = angular.copy($scope.assistant);

        $scope.cancel = function() {

            $modalInstance.close();
        };

        $scope.saveAssistant = function() {

            if ($scope.assistantForm.$valid) {
                $scope.assistant.save().then(function(assistant) {
                    console.log(assistant);

                    $scope.assistantCoaches.push(assistant);
                    $modalInstance.close();
                });
            }
        };

        $scope.toggleAssistant = function() {
            //$scope.assistant.tenureEnd = moment.utc();
        };

        $modalInstance.result.catch(function() {
            angular.extend($scope.assistant, $scope.assistant, backup);
        });
    }
]);


