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
    'MOBILE_APP_PROMPT_SHOWN',
    '$mdDialog'
];

function MobileAppDialogService (
    MOBILE_APP_PROMPT_SHOWN,
    $mdDialog
) {

    const definition = {

        show
    };

    function show () {

        const options = {

            controller,
            templateUrl
        };

        let modalShownThisSession = sessionStorage.getItem(MOBILE_APP_PROMPT_SHOWN);

        if (!modalShownThisSession) {

            try {

                sessionStorage.setItem(MOBILE_APP_PROMPT_SHOWN, true);
            } catch (e) {

                console.warn('Cannot use sessionStorage. Error:', e);
                // TODO: Fallback to some sort of cookie implementation
            }

            return $mdDialog.show(options);
        }
    }

    return definition;
}

export default MobileAppDialogService;
