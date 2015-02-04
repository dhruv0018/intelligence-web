/* Constants */
var TO = '';
var ELEMENT = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * AthleteProfileHeader
 * @module AthleteProfileHeader
 */
var AthleteProfileHeader = angular.module('AthleteProfileHeader', []);

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

            scope: {

            },

            link: link
        };

        function link($scope, element, attrs) {

        }

        return athleteProfileHeader;
    }
]);
