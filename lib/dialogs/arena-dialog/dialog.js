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

    function show(event, parent, item, league) {

        const showOptions = {

            controller: ArenaDialogController,

            templateUrl,

            targetEvent: event,

            parent: parent || undefined,

            locals: {

                item,

                league
            }
        };

        return $mdDialog.show(showOptions);
    }

    return definition;
}

export default ArenaDialogService;
