/* Module Imports */
import controller from './controller';

const templateUrl = 'mobile-app-dialog/template.html';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * MobileAppDialog Service
 * @module MobileAppDialog
 * @name MobileAppDialog.Service
 * @type {Service}
 */

MobileAppDialogService.$inject = [
    '$mdDialog'
];

function MobileAppDialogService(
    $mdDialog
) {

    const definition = {

        show: show
    };

    function show (prompt) {

        const options = {

            escapeToClose: false,
            controller,
            templateUrl
        };

        return $mdDialog.show(options);
    }

    return definition;
}

export default MobileAppDialogService;
