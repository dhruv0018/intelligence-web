/* Component dependencies */
require('basketball-hs-arena');
require('basketball-ncaa-arena');
require('basketball-nba-arena');
require('basketball-fiba-arena');

/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'arena/basketball/template.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Basketball Arena
 * @module Basketball Arena
 */
var BasketballArena = angular.module('Arena.Basketball', [
    'ui.router',
    'ui.bootstrap',
    'Arena.Basketball.HighSchool',
    'Arena.Basketball.NCAA',
    'Arena.Basketball.NBA',
    'Arena.Basketball.FIBA'
]);

/* Cache the template file */
BasketballArena.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Basketball Arena directive.
 * @module Basketball Arena
 * @name Basketball Arena
 * @type {Directive}
 */
BasketballArena.directive('basketballArena', [
    'ARENA_REGIONS',
    function directive(ARENA_REGIONS) {

        var BasketballArena = {

            restrict: TO += ELEMENTS,

            scope: {
                region: '=ngModel'
            },

            link: link,

            templateUrl: templateUrl
        };

        function updateRegion($scope, regionKey) {

            $scope.$apply(function applyUpdateRegion() {
                $scope.region.id = ARENA_REGIONS.BASKETBALL[regionKey].id;
            });
        }

        function link($scope, elem, attrs) {

            $scope.addEventListeners = function addEventListeners() {

                var aroundTheRim = document.getElementsByClassName('around-the-rim');
                var insideThePaint = document.getElementsByClassName('inside-the-paint');
                var midRange = document.getElementsByClassName('mid-range');
                var behindTheArc = document.getElementsByClassName('behind-the-arc');

                var i = 0;

                /*jshint loopfunc: true */
                /*eslint no-loop-func: 0 */
                for (i = 0; i < aroundTheRim.length; i++) {
                    aroundTheRim[i].addEventListener('click', function aroundTheRimClickHandler() {
                        updateRegion($scope, 'AROUND_THE_RIM');
                    });
                }

                /*jshint loopfunc: true */
                /*eslint no-loop-func: 0 */
                for (i = 0; i < insideThePaint.length; i++) {
                    insideThePaint[i].addEventListener('click', function insideThePaintClickHandler() {
                        updateRegion($scope, 'INSIDE_THE_PAINT');
                    });
                }

                /*jshint loopfunc: true */
                /*eslint no-loop-func: 0 */
                for (i = 0; i < midRange.length; i++) {
                    midRange[i].addEventListener('click', function midRangeClickHandler() {
                        updateRegion($scope, 'MID_RANGE');
                    });
                }

                /*jshint loopfunc: true */
                /*eslint no-loop-func: 0 */
                for (i = 0; i < behindTheArc.length; i++) {
                    behindTheArc[i].addEventListener('click', function behindTheArcClickHandler() {
                        updateRegion($scope, 'BEHIND_THE_ARC');
                    });
                }
            };
        }

        return BasketballArena;
    }
]);
