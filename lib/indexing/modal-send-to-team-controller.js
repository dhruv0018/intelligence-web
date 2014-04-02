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
 * @name Modal.SendToTeam.Controller
 * @type {Controller}
 */
Indexing.controller('Indexing.Modal.SendToTeam.Controller', [
    '$scope', '$modalInstance',
    function controller($scope, $modalInstance) {

        $scope.yes = function() {

            $modalInstance.close();
        };

        $scope.no = function() {

            $modalInstance.dismiss('no');
        };
    }
]);

