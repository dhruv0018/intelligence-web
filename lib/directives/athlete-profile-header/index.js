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
 * AthleteProfileHeader Directive
 * @module AthleteProfileHeader
 * @name AthleteProfileHeader
 * @type {directive}
 */
AthleteProfileHeader.directive('athleteProfileHeader', [
    'Utilities', 'BREAKPOINTS',
    function directive(utilities, BREAKPOINTS) {

        var athleteProfileHeader = {

            restrict: TO += ELEMENT,

            templateUrl: 'athlete-profile-header.html',

            scope: {
                athlete: '='
            },

            link: link
        };

        function link($scope, element, attributes) {

            var reader = new FileReader();

            $scope.utilities = utilities;

            $scope.toggle = {
                icons: {
                    current: 'keyboard_arrow_down',
                    collapsed: 'keyboard_arrow_down',
                    expanded: 'keyboard_arrow_up'
                },
                visibility: function visibility() {
                    var node = document.getElementsByClassName('athlete-secondary-info')[0];
                    // Toggling element visibility
                    node.classList.toggle('collapsed');
                    node.classList.toggle('expanded');
                    // Toggling element animations
                    node.classList.toggle('fadeIn');
                    node.classList.toggle('fadeOut');

                    // Toggling button icon
                    this.icons.current = (this.icons.current === this.icons.collapsed) ? this.icons.expanded : this.icons.collapsed;
                }
            };

            $scope.setProfileImage = function setProfileImage(files) {
                $scope.athlete.fileImage = files[0]; // resolve $scope.athlete

                reader.readAsDataURL(files[0]);

                reader.onload = function onload() {
                    $scope.athlete.profilePicture = reader.result;
                    $scope.$apply();
                };
            };

            utilities.matchMedia(
                '(min-width: ' + BREAKPOINTS.MD_SCREEN_SM + 'px)',
                function success() {
                    var secondaryInfoElem = document.getElementsByClassName('athlete-secondary-info')[0];
                    var classes = secondaryInfoElem.classList;
                    classes.remove('animated');
                    classes.remove('fadeOut');
                    classes.remove('collapsed');
                    classes.add('expanded');
                },
                function fail() {
                    var secondaryInfoElem = document.getElementsByClassName('athlete-secondary-info')[0];
                    var classes = secondaryInfoElem.classList;
                    classes.add('animated');
                    classes.add('fadeOut');
                    classes.add('collapsed');
                    classes.remove('expanded');
                }
            );
        }

        return athleteProfileHeader;
    }
]);
