/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Profile.About page module.
 * @module Profile.About
 */
const About = angular.module('Athlete.Profile.About');

/**
 * Profile.About dependencies
 */
AboutController.$inject = [
    '$scope',
    '$state',
    '$stateParams',
    'UsersFactory',
    'VIEWPORTS'
];

/**
 * Profile.About controller.
 * @module Profile.About
 * @name Profile.About.controller
 * @type {controller}
 */
function AboutController (
    $scope,
    $state,
    $stateParams,
    users,
    VIEWPORTS
) {
    $scope.athlete = users.get($stateParams.id);
    $scope.VIEWPORTS = VIEWPORTS;

    // Go to highlights state if screen size exceeds mobile viewport
    $scope.$watch('viewport', function() {
        if ($scope.viewport === VIEWPORTS.DESKTOP) {
            $scope.tabs.index = 0;
            $state.go('Athlete.Profile.Highlights');
        }
    });
}

About.controller('Athlete.Profile.About.controller', AboutController);

export default AboutController;
