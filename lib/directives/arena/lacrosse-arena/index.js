/* Component dependencies */
require('lacrosse-mens-outdoor-arena');
require('lacrosse-womens-outdoor-arena');

/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'arena/lacrosse/template.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Lacrosse Arena
 * @module Lacrosse Arena
 */
var LacrosseArena = angular.module('Arena.Lacrosse', [
    'ui.router',
    'ui.bootstrap',
    'Arena.Lacrosse.MensOutdoor',
    'Arena.Lacrosse.WomensOutdoor'
]);

/* Cache the template file */
LacrosseArena.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Lacrosse Arena directive.
 * @module Lacrosse Arena
 * @name Lacrosse Arena
 * @type {Directive}
 */
LacrosseArena.directive('lacrosseArena', [
    'ARENA_REGIONS',
    function directive(ARENA_REGIONS) {

        var LacrosseArena = {

            restrict: TO += ELEMENTS,

            scope: {
                region: '=ngModel'
            },

            link: link,

            templateUrl: templateUrl
        };

        function updateRegion($scope, regionKey) {

            $scope.$apply(function() {
                $scope.region.id = ARENA_REGIONS.LACROSSE[regionKey].id;
            });
        }

        function link($scope, elem, attrs) {

            $scope.addEventListeners = function() {

                var hole = document.getElementsByClassName('hole');
                var slot = document.getElementsByClassName('slot');
                var porch = document.getElementsByClassName('porch');
                var flanks = document.getElementsByClassName('flanks');
                var perimeter = document.getElementsByClassName('perimeter');

                var i = 0;

                /*jshint loopfunc: true */
                /*eslint no-loop-func: 0 */
                for (i = 0; i < hole.length; i++) {
                    hole[i].addEventListener('click', function() {
                        updateRegion($scope, 'HOLE');
                    });
                }

                /*jshint loopfunc: true */
                /*eslint no-loop-func: 0 */
                for (i = 0; i < slot.length; i++) {
                    slot[i].addEventListener('click', function() {
                        updateRegion($scope, 'SLOT');
                    });
                }

                /*jshint loopfunc: true */
                /*eslint no-loop-func: 0 */
                for (i = 0; i < porch.length; i++) {
                    porch[i].addEventListener('click', function() {
                        updateRegion($scope, 'PORCH');
                    });
                }

                /*jshint loopfunc: true */
                /*eslint no-loop-func: 0 */
                for (i = 0; i < flanks.length; i++) {
                    flanks[i].addEventListener('click', function() {
                        updateRegion($scope, 'FLANKS');
                    });
                }

                perimeter[0].addEventListener('click', function() {
                    updateRegion($scope, 'PERIMETER');
                });
            };
        }

        return LacrosseArena;
    }
]);
