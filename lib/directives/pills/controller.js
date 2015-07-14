/* Fetch angular from the browser scope */
const angular = window.angular;

/*
* PillsController dependencies
*/
PillsController.$inject = [
];

/**
 * PillsController controller.
 * @module PillsController
 * @name PillsController.controller
 * @type {controller}
 */
function PillsController (
) {

    this.itemRemoved = this.itemRemoved || angular.noop;

    this.remove = (item) => {

        if (!item) return;

        this.itemRemoved(item);
    };
}

export default PillsController;
