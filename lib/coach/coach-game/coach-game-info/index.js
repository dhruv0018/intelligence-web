/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component settings */
var templateUrl = 'coach/game/game-info.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Game info page module.
 * @module Info
 */
var Info = angular.module('Coach.Game.Info', []);

/* Cache the template file */
Info.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Info directive.
 * @module Info
 * @name Info
 * @type {directive}
 */
Info.directive('krossoverCoachGameInfo', [
    function directive() {

        var krossoverCoachGameInfo = {

            restrict: TO += ELEMENTS,
            templateUrl: templateUrl,
            controller: 'Coach.Game.Info.controller'
        };

        return krossoverCoachGameInfo;
    }
]);

/**
 * Info controller.
 * @module Info
 * @name Info.controller
 * @type {controller}
 */
Info.controller('Coach.Game.Info.controller', [
    '$scope', '$state', '$localStorage', 'GAME_TYPES', 'GAME_NOTE_TYPES', 'Coach.Game.Tabs', 'Coach.Game.Data', 'SessionService', 'TeamsFactory', 'LeaguesFactory', 'GamesFactory',
    function controller($scope, $state, $localStorage, GAME_TYPES, GAME_NOTE_TYPES, tabs, data, session, teams, leagues, games) {

        $scope.GAME_TYPES = GAME_TYPES;

        $scope.data = data;

        data.game.isHomeGame = data.game.isHomeGame === true ? 'true' : 'false';

        data.game.notes = data.game.notes || [];
        data.game.notes.unshift({
            noteTypeId: GAME_NOTE_TYPES.COACH_NOTE
        });

        var teamId = session.currentUser.currentRole.teamId;

        teams.get(teamId, function(team) {

            data.team = team;
            data.opposingTeam.leagueId = team.leagueId;
            data.game.teamId = team.id;
            data.game.primaryJerseyColor = team.primaryJerseyColor;
            data.game.secondaryJerseyColor = team.secondaryJerseyColor;
        });

        /* Setup opposing team. */
        data.opposingTeam = data.opposingTeam || {};

        $scope.save = function() {

            data.game.isHomeGame = data.game.isHomeGame === 'true';
            data.opposingTeam.isCustomerTeam = false;
            data.opposingTeam.primaryAwayColor = data.game.isHomeGame ? data.game.opposingPrimaryColor : null;
            data.opposingTeam.primaryHomeColor = data.game.isHomeGame ? null : data.game.opposingPrimaryColor;
            data.opposingTeam.secondaryAwayColor = data.game.isHomeGame ? data.game.opposingSecondaryColor : null;
            data.opposingTeam.secondaryHomeColor = data.game.isHomeGame ? null : data.game.opposingSecondaryColor;

            teams.save(data.opposingTeam).then(function(team) {

                data.opposingTeam = team;
                data.game.opposingTeamId = team.id;
                data.game.rosters = {};
                data.game.rosters[data.game.teamId] = {};
                data.game.rosters[data.game.opposingTeamId] = {};

                games.save(data.game).then(function(game) {

                    data.game = game;
                    tabs.activateTab('your-team');
                });
            });
        };
    }
]);

