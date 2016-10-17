const angular = window.angular;

import AssistantInfoController from './controller';

/**
 * AssistantInfo page module.
 * @module AssistantInfo
 */
const AssistantInfo = angular.module('AssistantInfo', [
    'ui.router',
    'ui.bootstrap'
]);

/**
 * AssistantInfo Modal
 * @module AssistantInfo
 * @name AssistantInfo.Modal
 * @type {service}
 */
AssistantInfo.value('AssistantInfo.ModalOptions', {

    templateUrl: 'lib/modals/info/assistant-info/template.html',
    controller: AssistantInfoController
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

        const Modal = {

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
AssistantInfo.controller('AssistantInfo.controller', AssistantInfoController);

export default AssistantInfo;
