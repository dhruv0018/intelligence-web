/* Constants */
var TO = '';
var ELEMENT = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/* Component resources */
var template = require('./template.html');

/**
 * AthleteProfileHeader
 * @module AthleteProfileHeader
 */
var AthleteProfileHeader = angular.module('AthleteProfileHeader', [
    'ngMdIcons'
]);

/* Cache the template file */
AthleteProfileHeader.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('athlete-profile-header.html', template);
    }
]);

/**
* AthleteProfileHeader dependencies
*/
AthleteProfileHeaderDirective.$inject = [
    'Utilities',
    'BREAKPOINTS',
    'AuthenticationService',
    'SessionService'
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
    session
) {
    var athleteProfileHeader = {

        restrict: TO += ELEMENT,

        templateUrl: 'athlete-profile-header.html',

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
