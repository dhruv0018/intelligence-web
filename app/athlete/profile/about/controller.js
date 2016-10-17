/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Profile.About dependencies
 */
AthleteProfileAboutController.$inject = [
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
function AthleteProfileAboutController (
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

export default AthleteProfileAboutController;
