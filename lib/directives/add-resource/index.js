/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Add Player
 * @module Add Player
 */
var addResource = angular.module('add-resource', []);

/* Cache the template file */
addResource.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('add-resource.html', template);
    }
]);

/**
 * Add Player directive.
 * @module Add Player
 * @name Add Player
 * @type {Directive}
 */
addResource.directive('addResource', [
    function directive() {

        var addResource = {

            restrict: TO += ELEMENTS,

            templateUrl: 'add-resource.html',

            scope: {
                addNewResource: '&',
                displayText: '@'
            },
            link: function(scope, element, attrs) {

            }
        };

        return addResource;
    }
]);
