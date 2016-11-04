/* Constants */
let TO = '';
const ELEMENT = 'E';

/* Fetch angular from the browser scope */
const angular = window.angular;

const templateUrl = 'lib/directives/athlete-profile-header/template.html';

/**
 * AthleteProfileHeader
 * @module AthleteProfileHeader
 */
const AthleteProfileHeader = angular.module('AthleteProfileHeader', [
]);

/**
* AthleteProfileHeader dependencies
*/
AthleteProfileHeaderDirective.$inject = [
    'Utilities',
    'BREAKPOINTS',
    'AuthenticationService',
    'SessionService',
    'SportsFactory'
];

/**
 * AthleteProfileHeader Directive
 * @module AthleteProfileHeader
 * @name AthleteProfileHeader
 * @type {directive}
 */
function AthleteProfileHeaderDirective (
    utilities,
    BREAKPOINTS,
    auth,
    session,
    sports
) {
    const athleteProfileHeader = {

        restrict: TO += ELEMENT,

        templateUrl: templateUrl,

        scope: {
            athlete: '='
        },

        link: link
    };

    function link($scope, element, attributes) {

        let reader = new FileReader();
        $scope.secondaryInfoElem = document.getElementsByClassName('athlete-secondary-info')[0];
        $scope.auth = auth;
        $scope.session = session;
        $scope.isCurrentUser = ($scope.athlete.id === $scope.session.getCurrentUserId());
        $scope.sports = sports.getMap();

        let mdScreenSmMediaQuery = '(min-width: ' + BREAKPOINTS.MD_SCREEN_SM + 'px)';

        function largerThanMdScreenSm() {
            let classes = $scope.secondaryInfoElem.classList;
            classes.remove('animated');
            classes.remove('fadeOut');
            classes.remove('collapsed');
            classes.add('expanded');
        }

        function smallerThanMdScreenSm() {
            let classes = $scope.secondaryInfoElem.classList;
            classes.add('animated');
            classes.add('fadeOut');
            classes.add('collapsed');
            classes.remove('expanded');
        }

        utilities.matchMedia(mdScreenSmMediaQuery, largerThanMdScreenSm, smallerThanMdScreenSm);
    }

    return athleteProfileHeader;
}

AthleteProfileHeader.directive('athleteProfileHeader', AthleteProfileHeaderDirective);

export default AthleteProfileHeaderDirective;
