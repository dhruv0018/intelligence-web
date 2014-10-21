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
    '$http', 'config', 'UsersFactory', 'PlayersFactory', 'AlertsService', 'ExcelUpload.Modal', 'AthleteInfo.Modal', 'ROLES',
    function directive($http, config, users, players, alerts, ExcelUpload, AthleteInfo, ROLES) {

        var rosterManager = {

            restrict: TO += ELEMENTS,
            templateUrl: 'roster-manager.html',
            scope: {
                team: '=?',
                positions: '=?',
                positionset: '=?',
                validator: '=?',
                roster: '=',
                rosterTemplateUrl: '=?',
                type: '@?',
                save: '=?',
                filtering: '=?',
                sortingType: '=?',
                users: '=?',
                game: '=?',
                editable: '='
            },
            replace: true,
            link: function(scope, element, attributes, ctrl) {
                scope.uploadFile = function(files) {
                    scope.files = files;
                    scope.$apply();
                };
                console.log('working team roster');
                scope.ROLES = ROLES;
                scope.keys = window.Object.keys;
                scope.usersFactory = users;
                scope.playersFactory = players;
                scope.players = players.getCollection();
                scope.options = {
                    scope: scope
                };

                scope.$watch('formTeamActive.$invalid', function(invalid) {

                    if (invalid) {
                        scope.validator = false;
                    } else {
                        scope.validator = true;
                    }

                });

                scope.addNewPlayer = function() {
                    console.log('team roster add new player');
                    var player = players.create();
                    var options = {
                        scope: scope,
                        targetAthlete: player
                    };
                    AthleteInfo.open(options);
                    scope.roster.push(player);
                };
            }

        };



        return rosterManager;
    }
]);
