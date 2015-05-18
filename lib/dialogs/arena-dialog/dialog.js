/* Module Imports */
import ArenaDialogController from './controller';

const templateUrl = 'arena-dialog/template.html';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * ArenaDialog Service
 * @module ArenaDialog
 * @name ArenaDialog.Service
 * @type {Service}
 */

ArenaDialogService.$inject = [
    '$mdDialog'
];

function ArenaDialogService(
    $mdDialog
) {

    const definition = {

        show
    };

    // TODO: Pass in scope some other way
    function show(event, item, league, parentElement = null) {

        const showOptions = {

            controller: ArenaDialogController,

            templateUrl: templateUrl,

            targetEvent: event,

            locals: {

                item,

                league
            }
        };

        /** If the parentElement is not null, the dialog
         *  box will be appended to the parent element
         */
        if(parentElement) {
            showOptions.parent = parentElement;
        }

        return $mdDialog.show(showOptions);
    }

    return definition;
}

export default ArenaDialogService;
