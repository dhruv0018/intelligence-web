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
    'Events',
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
    function directive() {

        var Play = {

            restrict: TO += ELEMENTS,

            replace: false,

            scope: {
                game: '=',
                play: '=',
                team: '=',
                opposingTeam: '=',
                league: '=',
                teamPlayers: '=',
                opposingTeamPlayers: '=',
                videoplayer: '=',
                expandAll: '='
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
    '$scope', '$modal', 'ROLES', 'SessionService', 'TeamsFactory', 'PlayManager',
    function controller($scope, $modal, ROLES, session, teams, play) {

        $scope.INDEXER = ROLES.INDEXER;

        $scope.currentUser = session.retrieveCurrentUser();

        $scope.$watch('expandAll', function(expandAll) {

            if (expandAll === true) {
                $scope.isOpen = true;
            } else {
                $scope.isOpen = false;
            }
        });

        $scope.$watch(function() {

            if (play && play.current) {

                return play.current.id;
            }

        }, function(currentPlayId) {

            $scope.currentPlayId = currentPlayId;
        });

        /**
         * Selects a play.
         */
        $scope.selectPlay = function(selectedPlay) {

            /* Set the current play to match the selected event. */
            play.current = selectedPlay;
        };

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
         * Sets the summaryScript with the highest summaryPriority
         */
        $scope.summaryScript = '';

        //play possession
        $scope.play.possessionTeamId = null;

        //collections
        var playersCollection = $scope.data.players.getCollection();
        $scope.teams =  $scope.data.teams.getCollection();

        var max = -1;
        angular.forEach($scope.play.events, function(event) {

            if (angular.isNumber(event.tag.summaryPriority) &&
                event.tag.summaryPriority > max) {

                max = event.tag.summaryPriority;
                $scope.summaryScript = event.tag.summaryScript || '';
            }

            Object.keys(event.variableValues).forEach(function(key) {
                if ($scope.play.possessionTeamId === null) {
                    var variableValue = event.variableValues[key];
                    if (variableValue.type === 'Team') {
                        if (variableValue.value == $scope.team.id) {
                            $scope.play.possessionTeamId = $scope.team.id;
                        } else {
                            $scope.play.possessionTeamId = $scope.opposingTeam.id;
                        }
                    }

                    if (variableValue.type === 'Player') {
                        var player = playersCollection[variableValue.value];

                        if (player.rosterIds.indexOf($scope.data.game.rosters[$scope.data.game.teamId].id) >= 0) {
                            $scope.play.possessionTeamId = $scope.data.game.teamId;
                        } else {
                            $scope.play.possessionTeamId = $scope.data.game.opposingTeamId;
                        }
                    }
                }
            });
        });
    }
]);
