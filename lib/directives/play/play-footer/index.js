/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'play-footer.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * PlayFooter
 * @module PlayFooter
 */
var PlayFooter = angular.module('PlayFooter', [
    'ui.bootstrap'
]);

/* Cache the template file */
PlayFooter.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put(templateUrl, template);
    }
]);

/**
 * PlayFooter directive.
 * @module PlayFooter
 * @name PlayFooter
 * @type {directive}
 */
PlayFooter.directive('playFooter', [
    function directive() {

        var Play = {

            restrict: TO += ELEMENTS,

            controller: controller,

            templateUrl: templateUrl
        };

        function controller($scope, $modal, $state, $stateParams, eventManager, videoPlayer, playManager, indexing) {
            /**
             * Deletes this play.
             */
            $scope.deletePlay = function() {

                $modal.open({

                    controller: 'Indexing.Modal.DeletePlay.Controller',
                    templateUrl: 'indexing/modal-delete-play.html'

                }).result.then(function() {

                        indexing.showTags = true;
                        indexing.showScript = false;
                        indexing.eventSelected = false;
                        indexing.isIndexing = false;

                        playManager.remove($scope.play);
                    });
            };
        }
        controller.$inject = ['$scope', '$modal', '$state', '$stateParams', 'EventManager', 'VideoPlayer', 'PlayManager', 'IndexingService'];
        return Play;
    }
]);
