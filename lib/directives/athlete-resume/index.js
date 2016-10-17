/* Constants */
let TO = '';
const ELEMENTS = 'E';
const templateUrl = 'lib/directives/athlete-resume/template.html';

import AthleteResumeController from './controller';
/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * AthleteResume
 * @module AthleteResume
 */
const AthleteResume = angular.module('AthleteResume', []);

/**
 * AthleteResume directive.
 * @module AthleteResume
 * @name AthleteResume
 * @type {directive}
 */
AthleteResume.directive('athleteResume', [
    function directive() {

        const AthleteResume = {

            restrict: TO += ELEMENTS,

            templateUrl: templateUrl,

            controller: AthleteResumeController,

            scope: {
                athlete: '='
            }
        };

        return AthleteResume;
    }
]);

export default AthleteResume;
