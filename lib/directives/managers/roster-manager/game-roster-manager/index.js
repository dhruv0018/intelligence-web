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
    '$http', 'config', 'UsersFactory', 'PlayersFactory', 'AlertsService', 'ExcelUpload.Modal', 'AthleteInfo.Modal', 'ROLES',
    function directive($http, config, users, players, alerts, ExcelUpload, AthleteInfo, ROLES) {

        var rosterManager = {

            restrict: TO += ELEMENTS,
            templateUrl: 'game-roster-manager.html',
            scope: {
                team: '=?',
                positions: '=?',
                positionset: '=?',
                validator: '=?',
                rosterTemplateUrl: '=?',
                save: '=?',
                filtering: '=?',
                sortingType: '=?',
                users: '=?',
                game: '=?',
                editable: '='
            },
            replace: true,
            link: function(scope, element, attributes) {
                scope.players = players.getCollection();
                console.log('game roster manager');
                console.log(scope);
                scope.$watch('formTeamActive.$invalid', function(invalid) {

                    if (invalid) {
                        scope.validator = false;
                    } else {
                        scope.validator = true;
                    }

                });

                scope.addNewPlayer = function() {
                    var player = players.create();
                    console.log('game roster add player');
                };

//                scope.toggleActivation = function(player) {
//                    if (player && player.id) {
//                        player.toggleActivation(scope.team);
//                        if (!scope.team.isCustomerTeam) {
//                            scope.roster.splice(scope.roster.indexOf(player), 1);
//                        }
//                    }
//
//                    else {
//                        scope.roster.splice(scope.roster.indexOf(player), 1);
//                    }
//                };
            }

        };



        return rosterManager;
    }
]);
