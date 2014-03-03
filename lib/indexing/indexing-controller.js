
/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Indexing page module.
 * @module Indexing
 */
var Indexing = angular.module('indexing');

/**
 * Indexing controller.
 * @module Indexing
 * @name Controller
 * @type {Controller}
 */
Indexing.controller('indexing.Controller', [
    '$scope', '$state', '$stateParams', '$sce', 'IndexingService',
    function controller($scope, $state, $stateParams, $sce, indexing) {

        $scope.HOME = indexing.HOME;
        $scope.AWAY = indexing.AWAY;

        $scope.indexing = indexing;

        $scope.tags = indexing.getFirstTags();

        $scope.selectTag = function(tagId) {

        };

        $scope.goBack = function() {

            $scope.indexing.game.save();
            $state.go('indexer-game', { id: $scope.indexing.game.id });
        };
    }
]);

