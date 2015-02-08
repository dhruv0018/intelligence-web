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
    function directive() {

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

            $scope.toInt = function toInt(num) {
                return Math.floor(num);
            };

            $scope.toggleSecondaryInfo = function() {
                var elem = document.getElementsByClassName('athlete-secondary-info')[0];
                var display = elem.style.display;

                elem.style.display = (display === 'none') ? 'block' : 'none';
            };

            $scope.setProfileImage = function(files) {
                $scope.athlete.fileImage = files[0]; // resolve $scope.athlete

                reader.readAsDataURL(files[0]);

                reader.onload = function() {
                    $scope.athlete.profilePicture = reader.result;
                    $scope.$apply();
                };
            };
        }

        return athleteProfileHeader;
    }
]);
