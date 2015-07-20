/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * SaveButton dependencies
 */
SaveButtonController.$inject = [
    '$scope',
    '$timeout'
];

/**
 * SaveButton controller.
 * @module SaveButton
 * @name SaveButton
 * @type {controller}
 */
function SaveButtonController (
    $scope,
    $timeout
) {
    $scope.isSaving =  $scope.isSaving || false;
    $scope.confirmSave = $scope.confirmSave || false;

    /*
     * Default save functionality, if resource is passed in
     */
    $scope.saveResource = function saveResource() {
        if ($scope.resource && $scope.isSaving === false) {
            $scope.isSaving = true;
            $scope.resource.save().then(function saveConfirmation() {
                // Add 2 seconds so user gets feedback even if save happens quickly
                $timeout(function() {
                    $scope.confirmSave = true;
                }, 1000);
                $timeout(function() {
                    $scope.isSaving = false;
                    $scope.confirmSave = false;
                }, 2000);
            });
        }
    };

}

export default SaveButtonController;
