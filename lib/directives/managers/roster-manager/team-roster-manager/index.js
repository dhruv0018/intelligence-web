/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * TeamRosterManager
 * @module roster-manager
 */
var TeamRosterManager = angular.module('team-roster-manager', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
TeamRosterManager.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('team-roster-manager.html', require('./template.html'));
    }
]);

/**
 * TeamRosterManager directive.
 * @module TeamRosterManager
 * @name TeamRosterManager
 * @type {Directive}
 */
TeamRosterManager.directive('teamRosterManager', [
    '$q', '$http', 'config', 'UsersFactory', 'PlayersFactory', 'TeamsFactory', 'AlertsService', 'ExcelUpload.Modal', 'AthleteInfo.Modal', 'ROLES', 'PlayerRosterEntryFactory',
    function directive($q, $http, config, users, players, teams, alerts, ExcelUpload, AthleteInfo, ROLES, playerRosterEntry) {

        var rosterManager = {

            restrict: TO += ELEMENTS,
            templateUrl: 'team-roster-manager.html',
            scope: {
                team: '=?',
                positions: '=?',
                positionset: '=?',
                validator: '=?',
                roster: '=',
                rosterTemplateUrl: '=?',
                type: '@?',
                filtering: '=?',
                users: '=?'
            },
            replace: true,
            link: {
                pre: pre,
                post: post
            }
        };

        function pre(scope, element, attributes) {
            scope.players = players.getCollection();
            scope.ROLES = ROLES;
            scope.usersFactory = users;
            scope.playersFactory = players;
            scope.rosterId = scope.team.roster.id;
            scope.excelUploadConfig = {type: 'team'};

            scope.options = {
                scope: scope
            };

            scope.playerRosterEntries = [];
            angular.forEach(scope.team.roster.playerInfo, function(rosterEntry) {
                scope.playerRosterEntries.push(playerRosterEntry.create(scope.team.roster.id, rosterEntry, scope.players[rosterEntry.id], scope.team));
            });
        }

        function post(scope, element, attributes) {
            scope.$watch('team', function(team) {
                var newRoster = [];
                angular.forEach(team.roster.playerInfo, function(rosterEntry) {
                    newRoster.push(playerRosterEntry.create(scope.team.roster.id, rosterEntry, scope.players[rosterEntry.id]));
                });
                scope.playerRosterEntries = newRoster;
            }, true);

            scope.uploadFile = function(files) {
                scope.files = files;
                scope.$apply();
            };

            scope.addNewPlayer = function() {
                var player = players.create();
                var options = {
                    scope: scope,
                    targetAthlete: player
                };
                AthleteInfo.open(options);
                scope.roster.push(player);
            };

            scope.sortPlayers = function(playerRosterEntry) {
                return Number(playerRosterEntry.playerInfo.jerseyNumber);
            };


            scope.save = function(player, user) {
                var playerPromise = player.save().then(function(responsePlayer) {
                    angular.extend(player, player, responsePlayer);
                    return player;
                });


                if (!user.email) {
                    return playerPromise;
                } else {
                    return playerPromise.then(function(responsePlayer) {
                        var userEmailCheck = users.fetch(user.email);

                        //user exists in the system
                        return userEmailCheck.then(function(responseUser) {
                            //the player is already correctly bound
                            if (player.userId === responseUser.id) {
                                return responsePlayer;
                            }
                            player.userId = responseUser.id;
                            angular.extend(user, responseUser);
                            users.addRole(ROLES.ATHLETE, scope.team);
                            user.save();

                            scope.team.addRole(user, ROLES.ATHLETE);
                            player.firstName = responseUser.firstName;
                            player.lastName = responseUser.lastName;
                            return player.save();
                        }, function() {
                            //user does not exist
                            user.firstName = player.firstName;
                            user.lastName = player.lastName;
                            users.addRole(ROLES.ATHLETE, scope.team);
                            return user.save().then(function(responseUser) {
                                player.userId = responseUser.id;
                                return player.save().then(function() {
                                    return player;
                                });
                            });
                        });



                    });
                }
            };

        }
        return rosterManager;
    }]);
