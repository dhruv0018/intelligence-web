/* Module Imports */
import controller from './controller';

const templateUrl = 'send-to-qa-dialog/template.html';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * SendToQa Service
 * @module SendToQaDialog
 * @name SendToQa.Service
 * @type {Service}
 */

SendToQaDialogService.$inject = [
    '$mdDialog'
];

function SendToQaDialogService(
    $mdDialog
) {

    const definition = {

        show
    };

    function show (locals) {

        const options = {
            locals,
            controller,
            templateUrl
        };

        return $mdDialog.show(options);
    }

    return definition;
}

export default SendToQaDialogService;
