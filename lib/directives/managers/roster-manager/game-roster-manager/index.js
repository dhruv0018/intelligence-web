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
    '$http', 'config', 'UsersFactory', 'PlayersFactory', 'AlertsService', 'ExcelUpload.Modal', 'AthleteInfo.Modal', 'ROLES', 'PlayerRosterEntryFactory','TeamsFactory','SessionService',
    function directive($http, config, users, players, alerts, ExcelUpload, AthleteInfo, ROLES, playerRosterEntry, teams, session) {

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

            scope.isHomeTeam = function(){
                return (scope.game.teamId === scope.team.id);
            };

            scope.isUserTeam = (scope.team && scope.team.id) ? session.currentUser.currentRole.teamId === scope.team.id : false;
            scope.excelUploadConfig = {type: 'game'};

            scope.$watch('game.rosters', function(newV, oldV) {
                scope.rosterId = (scope.game.teamId) ? scope.game.rosters[scope.team.id].id : null;
                var teamPlayerIds =  Object.keys(teams.get(scope.team.id).roster.playerInfo);
                var entries = [];
                var playerIds = [];
                angular.forEach(scope.game.rosters[scope.team.id].playerInfo, function(rosterEntry, playerId) {
                    if(!scope.players[playerId]){
                        playerIds.push(playerId);
                    }
                    var newPlayer = playerRosterEntry.create(scope.game.rosters[scope.team.id].id, rosterEntry, scope.players[playerId], scope.game);
                    newPlayer.isCustom = teamPlayerIds.indexOf(playerId.toString()) === -1 ? true : false;
                    entries.push(newPlayer);
                });
                if(playerIds.length>0){
                    players.load(playerIds).then(function(){
                        scope.players = players.getCollection();
                    });
                }
                scope.playerRosterEntries = entries;
            });

            scope.$watch('playerRosterEntries', function(newEntries, oldEntries) {

                scope.rosterHasEmptyRows = newEntries
                    .filter(entry => entry.playerInfo.isActive)
                    .filter(entry => {

                        if(entry.player) return !entry.player.isUnknown;
                    })
                    .some(entry => {

                        if(entry.player) return !entry.player.id;
                    });

                // scope.rosterMissingJerseyNumbers = newEntries
                //     .filter(entry => entry.playerInfo.isActive)
                //     .filter(entry => !entry.player.isUnknown)
                //     .some(entry => !entry.playerInfo.jerseyNumber.length ||
                //     entry.playerInfo.jerseyNumber.length <= 0);
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
                var tmpPlayer = playerRosterEntry.create(scope.game.rosters[scope.team.id].id, playerInfo, player, scope.game);
                tmpPlayer.isCustom = true;
                scope.playerRosterEntries.push(tmpPlayer);
            };

            scope.isUnknown = function(rosterEntry) {
                return (rosterEntry.player && !rosterEntry.player.isUnknown);
            };

        }



        return rosterManager;
    }
]);
