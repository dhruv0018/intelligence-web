/* Fetch angular from the browser scope */
const angular = window.angular;

/*
* CustomTagPillsController dependencies
*/
CustomTagPillsController.$inject = [
    '$scope'
];

/**
 * CustomTagPillsController controller.
 * @module CustomTagPillsController
 * @name CustomTagPillsController.controller
 * @type {controller}
 */
function CustomTagPillsController (
    $scope
) {

    $scope.removeTag = function removeTag(tag) {
        if (!tag) return;

        let index = $scope.selectedTags.indexOf(tag);
        $scope.selectedTags.splice(index, 1);
    };
}

export default CustomTagPillsController;
