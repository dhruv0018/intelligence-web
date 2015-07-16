/* Module Imports */
import controller from './controller';

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

    function show(scope) {

        // const showOptions = {
        //
        //     controller: ArenaDialogController,
        //
        //     templateUrl,
        //
        //     targetEvent: event,
        //
        //     parent,
        //
        //     locals: {
        //
        //         item,
        //
        //         league
        //     }
        // };

        let showOptions = {scope, controller, templateUrl};

        return $mdDialog.show(showOptions);
    }

    return definition;
}

export default ArenaDialogService;
