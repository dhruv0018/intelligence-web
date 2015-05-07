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

        show,
        hide
    };

    // TODO: Pass in scope some other way
    function show(event, item, league) {

        const showOptions = {

            controller: ArenaDialogController,

            templateUrl: templateUrl,

            targetEvent: event,

            locals: {

                item,

                league
            }
        };

        return $mdDialog.show(showOptions);
    }

    function hide() {

        return $mdDialog.hide();
    }

    return definition;
}

export default ArenaDialogService;
