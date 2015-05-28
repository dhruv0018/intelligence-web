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

    function show(event, item, league) {

        const indexingElement = document.getElementsByClassName('indexing')[0];
        const parent = angular.element(indexingElement);

        const showOptions = {

            controller: ArenaDialogController,

            templateUrl,

            targetEvent: event,

            parent,

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
