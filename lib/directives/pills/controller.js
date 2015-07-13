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

    this.remove = (item) => {

        if (!item) return;

        this.removedItem = item;
    };
}

export default PillsController;
