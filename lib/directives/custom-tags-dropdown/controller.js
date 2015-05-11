/* Fetch angular from the browser scope */
const angular = window.angular;

/*
* CustomTagsDropdown dependencies
*/
CustomTagsDropdownController.$inject = [
    '$scope',
    '$filter'
];

/**
 * CustomTagsDropdown controller.
 * @module CustomTagsDropdown
 * @name CustomTagsDropdown.controller
 * @type {controller}
 */
function CustomTagsDropdownController (
    $scope,
    $filter
) {
    $scope.customTags = [
        {
            id: 1,
            name: 'Shotgun'
        },
        {
            id: 2,
            name: 'Pistol'
        },
        {
            id: 3,
            name: 'Wildcat'
        }
    ];

    $scope.selectedTags = [];

    $scope.selectTag = function selectTag(tag) {
        $scope.selectedTags.push(tag);
    };

    $scope.removeTag = function removeTag(tag) {
        if (!tag) return;

        let index = $scope.selectedTags.indexOf(tag);
        $scope.selectedTags.splice(index, 1);
    };
}

export default CustomTagsDropdownController;
