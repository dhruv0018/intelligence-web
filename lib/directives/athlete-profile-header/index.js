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
    'Utilities',
    function directive(utilities) {

        var athleteProfileHeader = {

            restrict: TO += ELEMENT,

            templateUrl: 'athlete-profile-header.html',

            scope: {
                athlete: '='
            },

            link: link
        };

        function link($scope, element, attrs) {

            var reader = new FileReader();

            $scope.utilities = utilities;

            $scope.toggle = {
                icons: {
                    current: 'keyboard_arrow_down',
                    collapsed: 'keyboard_arrow_down',
                    expanded: 'keyboard_arrow_up'
                },
                callback: function callback() {
                    // Toggling secondary info
                    var node = document.getElementsByClassName('athlete-secondary-info')[0];
                    node.style.maxHeight = (node.style.maxHeight === '0px') ? '273px' : '0px';
                    // Toggling synced animations
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

            /* TO-DO: This is a hack, along with the inline style
             * on section.athlete-secondary-info. Also because this
             * solution doesn't use CSS and media queries, it causes a
             * display bug. If this element is collapsed, on devices
             * that are < 600px in width but >= 600px in height,
             * when starting on the page in portrait, rotating the
             * device displays a landscape profile view with no header.
             * The user solution is to refresh the page, or rotate to
             * portrait and toggle the header.
             */
            if (window.innerWidth >= 600) {
                var elem = document.getElementsByClassName('athlete-secondary-info')[0];
                elem.removeAttribute('style');
                var classes = elem.classList;
                classes.remove('animated');
                classes.remove('fadeOut');
            }
        }

        return athleteProfileHeader;
    }
]);
