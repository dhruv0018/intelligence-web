/* Constants */
var TO = '';
var ELEMENTS = 'E';
var ATTRIBUTES = 'A';

var templateUrl = 'play.html';

require('play-header');
require('play-footer');

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Play
 * @module Play
 */
var Play = angular.module('Play', [
    'Events',
    'PlayHeader',
    'PlayFooter',
    'ui.bootstrap'
]);

/* Cache the template file */
Play.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Play directive.
 * @module Play
 * @name Play
 * @type {directive}
 */
Play.directive('krossoverPlay', [
    '$timeout',
    function directive(
        $timeout
    ) {

        var Play = {

            restrict: TO += ELEMENTS + ATTRIBUTES,

            link: link,

            controller: 'Play.controller',
            controllerAs: 'playController',
            templateUrl: templateUrl
        };

        function link ($scope, element, attributes) {

            const currentPlayWatch = $scope.$watch('playManager.current', onCurrentPlay);

            function onCurrentPlay (currentPlay) {

                if ($scope.play === currentPlay) {

                    $timeout(scrollPlayIntoView, 0, false);
                }
            }

            function scrollPlayIntoView () {

                element[0].scrollIntoView();
            }

            element.on('$destroy', onDestroy);

            function onDestroy () {

                /* Remove $watch on playManager.current */
                currentPlayWatch();
            }
        }

        return Play;
    }
]);

/* File Dependencies */
require('./controller');
