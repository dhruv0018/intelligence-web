/* Module Imports */
import ArenaDialogController from './controller';
import templateUrl from './index.js';

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

        const item = document.getElementsByTagName('krossover-item-arena')[0];
        const parent = angular.element(item);

        const showOptions = {

            controller: ArenaDialogController,

            templateUrl: templateUrl,

            targetEvent: event,

            scope: $scope,

            preserveScope: true,

            clickOutsideToClose: true,

            parent: parent
        };

        const promise = $mdDialog.show(showOptions);

        return promise;
    }

    return definition;
}

export default ArenaDialogService;
