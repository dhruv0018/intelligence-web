/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Film Header
 * @module Film Header
 */
var filmHeader = angular.module('film-header', []);

/* Cache the template file */
filmHeader.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('film-header.html', template);
    }
]);

/**
 * Film Header directive.
 * @module Film Header
 * @name Film Header
 * @type {Directive}
 */
filmHeader.directive('filmHeader', [

    function directive() {

        var filmHeader = {

            restrict: TO += ELEMENTS,

            scope: {
                'isPublic': '=',
                'game': '=',
                'homeTeam': '=',
                'opposingTeam': '=',
                'user': '='
            },

            link: link,

            templateUrl: 'film-header.html',

        };

        var link = function($scope, element, attrs) {

            console.log($scope.isPublic);
        };

        return filmHeader;
    }
]);
