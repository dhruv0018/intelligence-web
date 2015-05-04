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

        show: show
    };

    // TODO: Pass in scope some other way
    function show(event, $scope) {

        const itemElement = document.getElementsByTagName('krossover-item-arena')[0];
        const parent = angular.element(itemElement);
        const scope = parent.scope();

        const showOptions = {

            controller: ArenaDialogController,

            templateUrl: templateUrl,

            targetEvent: event,

            scope: $scope,

            preserveScope: true
        };

        return $mdDialog.show(showOptions);
    }

    return definition;
}

export default ArenaDialogService;
