/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Indexing page module.
 * @module Indexing
 */
var Indexing = angular.module('Indexing');

/**
 * Modal controller. Controls the modal view.
 * @module Indexing
 * @name Modal.DeletePlay.Controller
 * @type {Controller}
 */
Indexing.controller('Indexing.Modal.DeletePlay.Controller', [
    '$scope', '$modal', '$modalInstance',
    function controller($scope, $modal, $modalInstance) {

        $scope.ok = function() {

            $modalInstance.close();
        };

        $scope.cancel = function() {

            $modalInstance.dismiss('cancel');
        };
    }
]);

