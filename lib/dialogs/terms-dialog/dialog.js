/* Module Imports */
import controller from './controller';

const templateUrl = 'terms-dialog/template.html';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * TermsDialog Service
 * @module TermsDialog
 * @name TermsDialog.Service
 * @type {Service}
 */

TermsDialogService.$inject = [
    '$mdDialog'
];

function TermsDialogService(
    $mdDialog
) {

    const definition = {

        show: show
    };

    function show (prompt) {

        const options = {

            controller,
            templateUrl,
            locals: {prompt}
        };

        return $mdDialog.show(options);
    }

    return definition;
}

export default TermsDialogService;
