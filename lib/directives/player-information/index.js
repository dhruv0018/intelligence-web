/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * PlayerInformation
 * @module PlayerInformation
 */
var PlayerInformation = angular.module('PlayerInformation', []);

/* Cache the template file */
PlayerInformation.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('PlayerInformation.html', template);
    }
]);

/**
 * PlayerInformation directive.
 * @module PlayerInformation
 * @name PlayerInformation
 * @type {Directive}
 */
PlayerInformation.directive('playerInformation', [
    function directive() {

        function link(scope) {
            console.log('working');
            scope.user = {
                firstName: 'first',
                lastName: 'last'
            };
        }

        var PlayerInformation = {

            restrict: TO += ELEMENTS,

            templateUrl: 'PlayerInformation.html',

            link: link
        };

        return PlayerInformation;
    }
]);

