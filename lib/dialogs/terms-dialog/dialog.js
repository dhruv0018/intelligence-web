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
    '$mdDialog',
    'TwitterService'
];

function TermsDialogService(
    $mdDialog,
    twitter
) {

    const definition = {

        show: show
    };

    function show (prompt) {

        const options = {

            onComplete: function createTwitterFollow () {

                twitter.createFollowButton('new-terms-twitter-follow');
            },
            controller,
            templateUrl,
            escapeToClose: false,
            locals: {prompt}
        };

        return $mdDialog.show(options);
    }

    return definition;
}

export default TermsDialogService;
