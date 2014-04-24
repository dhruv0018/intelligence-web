/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Play
 * @module Play
 */
var Play = angular.module('Indexing.Play', [
    'Indexing.Events'
]);

/* Cache the template file */
Play.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('indexing/play.html', template);
    }
]);

/**
 * Play directive.
 * @module Play
 * @name Play
 * @type {Directive}
 */
Play.directive('krossoverPlay', [
    function directive() {

        var Play = {

            restrict: TO += ELEMENTS,

            replace: true,

            scope: {
                play: '='
            },

            link: link,

            controller: 'Indexing.Play.controller',

            templateUrl: 'indexing/play.html',

        };

        function link($scope, element, attributes) {

        }

        return Play;
    }
]);

/**
 * Indexing play controller.
 * @module Indexing
 * @name Sidebar.Play.controller
 * @type {Controller}
 */
Indexing.controller('Indexing.Play.controller', [
    '$scope', '$modal', 'Indexing.PlayService',
    function controller($scope, $modal, play) {

        /**
         * Deletes a play.
         */
        $scope.deletePlay = function(selectedPlay) {

            $modal.open({

                controller: 'Indexing.Modal.DeletePlay.Controller',
                templateUrl: 'indexing/modal-delete-play.html'

            }).result.then(function() {

                play.remove(selectedPlay);
            });
        };
    }
]);
