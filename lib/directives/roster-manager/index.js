/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * RosterManager
 * @module roster-manager
 */
var RosterManager = angular.module('roster-manager', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
RosterManager.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('roster-manager.html', require('./template.html'));
    }
]);

/**
 * RosterManager directive.
 * @module RosterManager
 * @name RosterManager
 * @type {Directive}
 */
RosterManager.directive('krossoverRosterManager', [
    '$http', 'config', 'PlayersFactory', 'AlertsService', 'ExcelUpload.Modal',
    function directive($http, config, players, data, alerts, ExcelUpload) {

        var rosterManager = {

            restrict: TO += ELEMENTS,
            templateUrl: 'roster-manager.html',
            scope: {
                rosterId: '=?',
                roster: '=?',
                positions: '=?',
                validator: '=?',
                rosterTemplateUrl: '=?'
            },
            replace: true,
            link: function(scope, element, attributes) {

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

                scope.isActive = function(player) {
                    return player.rosterStatuses[scope.rosterId] !== false;
                };

                scope.addNewPlayer = function() {

                    var player = {

                        jerseyNumbers: {},
                        rosterStatuses: {},
                        positions: {},
                        selectedPositions: {}
                    };

                    player.selectedPositions[scope.rosterId] = [];

                    player.rosterStatuses[scope.rosterId] = true;

                    scope.roster.push(player);

                };

                scope.deactivate = function(player) {

                    if (player && player.id) {

                        player.toggleActivation(scope.rosterId);
                    }

                    else {

                        scope.roster.splice(scope.roster.indexOf(player), 1);
                    }
                };

                scope.uploadFile = function(files) {
                    scope.files = files;
                    scope.$apply();
                };
            }

        };

        return rosterManager;
    }
]);
