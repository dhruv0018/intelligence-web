/* Module Imports */
import BreakdownDialogController from './controller';

const templateUrl = 'breakdown-dialog/template.html';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * BreakdownDialog Service
 * @module BreakdownDialog
 * @name BreakdownDialog.Service
 * @type {Service}
 */

BreakdownDialogService.$inject = [
    '$mdDialog'
];

function BreakdownDialogService(
    $mdDialog
) {

    const definition = {

        show
    };

    function show(event, parent, playIds) {

        const showOptions = {

            controller: BreakdownDialogController,

            templateUrl,

            targetEvent: event,

            parent,

            onComplete: afterShowAnimation,

            locals: {

                playIds

            }

        };

        // When the 'enter' animation finishes...
        function afterShowAnimation(scope, element, options) {

            scope.animationComplete = true;
        }

        return $mdDialog.show(showOptions);
    }

    return definition;
}

export default BreakdownDialogService;
