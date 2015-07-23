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

    const definition = {show};

    function show(scope) {
        let locals = {field: scope.field};
        let showOptions = {controller, templateUrl, locals};

        return $mdDialog.show(showOptions);
    }

    return definition;
}

export default ArenaDialogService;
