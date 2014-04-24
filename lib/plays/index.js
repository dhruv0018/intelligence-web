/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Plays
 * @module Plays
 */
var Plays = angular.module('Indexing.Plays', [
    'Indexing.Play'
]);

/* Cache the template file */
Plays.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('indexing/plays.html', template);
    }
]);

/**
 * Plays directive.
 * @module Plays
 * @name Plays
 * @type {Directive}
 */
Plays.directive('krossoverPlays', [
    function directive() {

        var Plays = {

            restrict: TO += ELEMENTS,

            replace: true,

            scope: {
                play: '='
            },

            link: link,

            templateUrl: 'indexing/plays.html',

        };

        function link($scope, element, attributes) {

        }

        return Plays;
    }
]);

