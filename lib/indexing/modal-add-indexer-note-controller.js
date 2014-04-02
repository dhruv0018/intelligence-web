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
 * @name Modal.AddIndexerNote.Controller
 * @type {Controller}
 */
Indexing.controller('Indexing.Modal.AddIndexerNote.Controller', [
    '$scope', '$modalInstance', 'IndexingService', 'TeamsFactory', 'UsersFactory',
    function controller($scope, $modalInstance, indexing, teams, users) {

        $scope.game = indexing.game;

        teams.get(indexing.team.id, function(team) {

            var headCoachRole = team.getHeadCoachRole();

            if (headCoachRole) {

                users.get(headCoachRole.userId, function(user) {

                    $scope.headCoach = user;
                });
            }
        });

        $scope.submit = function() {

            $modalInstance.close();
        };
    }
]);

