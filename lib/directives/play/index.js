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
                team: '=',
                play: '=',
                plays: '=',
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

        $scope.isOpen = false;

        $scope.play.period = $scope.play.period || $scope.game.currentPeriod;

        $scope.play.teamPointsAssigned = $scope.play.teamPointsAssigned || 0;
        $scope.play.opposingPointsAssigned = $scope.play.opposingPointsAssigned || 0;

        $scope.play.teamIndexedScore = $scope.play.teamIndexedScore || 0;
        $scope.play.opposingIndexedScore = $scope.play.opposingIndexedScore || 0;

        /* Indicates if the play has visible events; set by the events. */
        $scope.play.hasVisibleEvents = false;

        /* Current play summary; filled in by the events. */
        $scope.play.summary = {};

        /* All of the play summaries; filled in by the events. */
        $scope.play.summaries = [];

        /* Play possesion; filled in by the events. */
        $scope.play.possessionTeamId = null;

        var teamId = $scope.game.teamId;
        var opposingTeamId = $scope.game.opposingTeamId;

        $scope.teams = $scope.teams || {};
        $scope.teams[teamId] = teams.get(teamId);
        $scope.teams[opposingTeamId] = teams.get(opposingTeamId);

        $scope.openPlay = function() {
            if ($scope.expandAll === false) {
                $scope.isOpen = !$scope.isOpen;
            }
        };

        $scope.$watch(function() {

            if (play && play.current) {

                return play.current.id;
            }

        }, function(currentPlayId) {

            $scope.currentPlayId = currentPlayId;
        });

        var playIndex = $scope.plays.indexOf($scope.play);
        var previousPlay = $scope.plays[playIndex - 1];

        /* Watch the team score in the previous play. */
        $scope.$watch(function() {

            if (!previousPlay) return 0;

            var teamIndexedScore = previousPlay.teamIndexedScore;

            return teamIndexedScore + $scope.play.teamPointsAssigned;

        }, function(teamIndexedScore) {

            $scope.play.teamIndexedScore = teamIndexedScore;
        });

        /* Watch the opposing team score in the previous play. */
        $scope.$watch(function() {

            if (!previousPlay) return 0;

            var opposingIndexedScore = previousPlay.opposingIndexedScore;

            return opposingIndexedScore + $scope.play.opposingPointsAssigned;

        }, function(opposingIndexedScore) {

            $scope.play.opposingIndexedScore = opposingIndexedScore;
        });

        $scope.$watch('expandAll', function(expandAll) {

            $scope.isOpen = expandAll;
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
    }
]);
