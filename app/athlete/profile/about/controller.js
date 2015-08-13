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
    '$window',
    'UsersFactory',
    'BREAKPOINTS'
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
    $window,
    users,
    BREAKPOINTS
) {
    $scope.athlete = users.get($stateParams.id);

    $scope.$watch( () => {
        return $window.innerWidth;
    }, (windowWidth) => {
        if (windowWidth >= BREAKPOINTS.MD_SCREEN_MD) {
            $scope.tabs.index = 0;
            $state.go('Athlete.Profile.Highlights');
        }
    });
}

About.controller('Athlete.Profile.About.controller', AboutController);

export default AboutController;
