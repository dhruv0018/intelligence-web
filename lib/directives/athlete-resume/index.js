/* Constants */
let TO = '';
const ELEMENTS = 'E';

const templateUrl = 'athlete-resume.html';

/* Component resources */
const template = require('./template.html');

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * AthleteResume
 * @module AthleteResume
 */
const AthleteResume = angular.module('AthleteResume', []);

/* Cache the template file */
AthleteResume.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

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

            controller: 'AthleteResume.Controller',

            scope: {
                athlete: '='
            }
        };

        return AthleteResume;
    }
]);

/* File dependencies */
require('./controller');