/* Constants */
let TO = '';
const ELEMENTS = 'E';

const templateUrl = 'arena/ice-hockey/template.html';

/* Component resources */
const template = require('./template.html');

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * IceHockey Arena
 * @module IceHockey Arena
 */
const IceHockeyArena = angular.module('Arena.IceHockey', []);

/* Cache the template file */
IceHockeyArena.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * IceHockey Arena directive.
 * @module IceHockey Arena
 * @name IceHockey Arena
 * @type {Directive}
 */
IceHockeyArena.directive('iceHockeyArena', [
    'ARENA_REGIONS',
    function directive(ARENA_REGIONS) {

        const definition = {

            restrict: TO += ELEMENTS,

            scope: {
                region: '=ngModel'
            },

            link,

            templateUrl
        };

        function link($scope, element, attributes) {

            function addEventListeners(element) {

                const behindTheNet = element.querySelectorAll('.behind-the-net');
                const aroundTheNet = element.querySelectorAll('.around-the-net');
                const slot = element.querySelectorAll('.slot');
                const wing = element.querySelectorAll('.wing');
                const blueLine = element.querySelectorAll('.blue-line');
                const outsideTheZone = element.querySelectorAll('.outside-the-zone');

                let i = 0;

                /*jshint loopfunc: true */
                /*eslint no-loop-func: 0 */
                for(i = 0; i < behindTheNet.length; i++) {

                    behindTheNet[i].addEventListener('click', () => updateRegion('BEHIND_THE_NET'));
                }

                /*jshint loopfunc: true */
                /*eslint no-loop-func: 0 */
                for(i = 0; i < aroundTheNet.length; i++) {

                    aroundTheNet[i].addEventListener('click', () => updateRegion('AROUND_THE_NET'));
                }

                /*jshint loopfunc: true */
                /*eslint no-loop-func: 0 */
                for(i = 0; i < slot.length; i++) {

                    slot[i].addEventListener('click', () => updateRegion('SLOT'));
                }

                /*jshint loopfunc: true */
                /*eslint no-loop-func: 0 */
                for(i = 0; i < wing.length; i++) {

                    wing[i].addEventListener('click', () => updateRegion('WING'));
                }

                /*jshint loopfunc: true */
                /*eslint no-loop-func: 0 */
                for(i = 0; i < blueLine.length; i++) {

                    blueLine[i].addEventListener('click', () => updateRegion('BLUE_LINE'));
                }

                /*jshint loopfunc: true */
                /*eslint no-loop-func: 0 */
                for(i = 0; i < outsideTheZone.length; i++) {

                    outsideTheZone[i].addEventListener('click', () => updateRegion('OUTSIDE_THE_ZONE'));
                }
            }

            function updateRegion(regionKey) {

                $scope.$apply(() => {

                    $scope.region.id = ARENA_REGIONS.ICE_HOCKEY[regionKey].id;
                });
            }

            addEventListeners(element[0]);
        }

        return definition;
    }
]);
