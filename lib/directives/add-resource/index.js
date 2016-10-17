/* Constants */
var TO = '';
var ELEMENTS = 'E';

const AddResourceTemplateUrl = 'lib/directives/add-resource/template.html';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Add Player
 * @module Add Player
 */
var addResource = angular.module('add-resource', []);

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

            templateUrl: AddResourceTemplateUrl,

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

export default addResource;
