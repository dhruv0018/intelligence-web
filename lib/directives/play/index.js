/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'play.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Play
 * @module Play
 */
var Play = angular.module('Play', [
    'Events'
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
    function directive() {

        var Play = {

            restrict: TO += ELEMENTS,

            replace: true,

            scope: {
                play: '=',
                team: '=',
                opposingTeam: '=',
                league: '=',
                videoplayer: '='
            },

            link: link,

            controller: 'Play.controller',

            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

        }

        return Play;
    }
]);

/**
 * Play controller.
 * @module Play
 * @name Play.controller
 * @type {controller}
 */
Play.controller('Play.controller', [
    '$scope', '$modal', 'PlayManager', 'SessionService', 'ROLES',
    function controller($scope, $modal, play, session, ROLES) {


        $scope.INDEXER = ROLES.INDEXER;

        $scope.currentUser = session.currentUser;

        $scope.$watch(function() {

            if (play && play.current) {

                return play.current.id;
            }

        }, function(currentPlayId) {

            $scope.currentPlayId = currentPlayId;
        });

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

        /**
         * Returns the summaryScript with the highest summaryPriority 
         */
        $scope.getSummaryScript = function() {

            var x = '',
                max = -1;

            if ($scope.play.events.length > 0) {
                for (var i = 0; i < $scope.play.events.length; i++) {

                    if (angular.isNumber($scope.play.events[i].tag.summaryPriority) &&
                        $scope.play.events[i].tag.summaryPriority > max) {

                        min = $scope.play.events[i].tag.summaryPriority;
                        x = $scope.play.events[i].tag.summaryScript || '';
                    }
                }
            }

            return x;
        };
    }
]);
