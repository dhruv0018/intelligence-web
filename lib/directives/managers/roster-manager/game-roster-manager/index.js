/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * GameRosterManager
 * @module roster-manager
 */
var GameRosterManager = angular.module('game-roster-manager', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
GameRosterManager.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('game-roster-manager.html', require('./template.html'));
    }
]);

/**
 * GameRosterManager directive.
 * @module GameRosterManager
 * @name GameRosterManager
 * @type {Directive}
 */
GameRosterManager.directive('gameRosterManager', [
    '$http', 'config', 'UsersFactory', 'PlayersFactory', 'AlertsService', 'ExcelUpload.Modal', 'AthleteInfo.Modal', 'ROLES', 'PlayerRosterEntryFactory',
    function directive($http, config, users, players, alerts, ExcelUpload, AthleteInfo, ROLES, playerRosterEntry) {

        var rosterManager = {

            restrict: TO += ELEMENTS,
            templateUrl: 'game-roster-manager.html',
            scope: {
                team: '=?',
                positionset: '=?',
                rosterTemplateUrl: '=?',
                save: '=?',
                filtering: '=?',
                sortingType: '=?',
                users: '=?',
                game: '=?',
                editable: '='
            },
            replace: true,
            link: {
                pre: pre,
                post: post
            }

        };

        function pre(scope, element, attributes) {
            scope.players = players.getCollection();
            scope.playerRosterEntries = [];
            scope.rosterState = { isSaving: false };
        }

        function post(scope, element, attributes) {

            scope.options = {
                scope: scope
            };

            scope.uploadFile = function(files) {
                scope.files = files;
                scope.$apply();
            };

            scope.excelUploadConfig = {type: 'game'};

            scope.$watch('game.rosters', function() {
                scope.rosterId = (scope.game.teamId) ? scope.game.rosters[scope.team.id].id : null;

                var entries = [];
                angular.forEach(scope.game.rosters[scope.team.id].playerInfo, function(rosterEntry, playerId) {
                    entries.push(playerRosterEntry.create(scope.game.rosters[scope.team.id].id, rosterEntry, scope.players[playerId], scope.game));
                });
                scope.playerRosterEntries = entries;
            });

            scope.$watchCollection('playerRosterEntries', function(newEntries, oldEntries) {

                scope.rosterHasEmptyRows = newEntries
                    .some(entry => !entry.player.id);
            });

            scope.addNewPlayer = function() {

                if (
                    scope.rosterHasEmptyRows ||
                    scope.rosterState.isSaving
                ) return;

                var playerInfo = {
                    isActive: true,
                    positionIds: [],
                    jerseyNumber: ''
                };
                var player = players.create();
                scope.playerRosterEntries.push(playerRosterEntry.create(scope.game.rosters[scope.team.id].id, playerInfo, player, scope.game));
            };

            scope.isUnknown = function(rosterEntry) {
                return (rosterEntry.player && !rosterEntry.player.isUnknown);
            };

        }



        return rosterManager;
    }
]);
