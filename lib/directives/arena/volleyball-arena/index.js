/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'arena/volleyball/template.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Volleyball Arena
 * @module Volleyball Arena
 */
var VolleyballArena = angular.module('Arena.Volleyball', []);

/* Cache the template file */
VolleyballArena.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Volleyball Arena directive.
 * @module Volleyball Arena
 * @name Volleyball Arena
 * @type {Directive}
 */
VolleyballArena.directive('volleyballArena', [
    'ARENA_REGIONS',
    function directive(ARENA_REGIONS) {

        var VolleyballArena = {

            restrict: TO += ELEMENTS,

            scope: {
                region: '=ngModel'
            },

            link: link,

            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

            function addEventListeners(element) {

                const court = element.querySelectorAll('.court');

                court[0].addEventListener('click', function courtClickHandler() {
                    updateRegion('COURT');
                });
            }

            function updateRegion(regionKey) {

                $scope.$apply(() => {

                    $scope.region.id = ARENA_REGIONS.VOLLEYBALL[regionKey].id;
                });
            }

            addEventListeners(element[0]);
        }

        return VolleyballArena;
    }
]);
