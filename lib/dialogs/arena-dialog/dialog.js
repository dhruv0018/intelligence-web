/* Module Imports */
import ArenaDialogController from './controller';
import templateUrl from './index.js';

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

        show: show
    };

    function show(event) {

        const showOptions = {

            controller: ArenaDialogController,

            templateUrl: templateUrl,

            targetEvent: event
        };

        const promise = $mdDialog.show(showOptions);

        return promise;
    }

    return definition;
}

export default ArenaDialogService;
