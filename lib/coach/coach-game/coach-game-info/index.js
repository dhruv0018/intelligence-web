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
            controller: 'Coach.Game.Info.controller',

            scope: {

                game: '=?'
            },
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

        $scope.tabs = tabs;
        $scope.data = data;

        $scope.$watch('game.teamId', function(teamId) {

            if (teamId) {

                teams.get(teamId, function(team) {

                    data.team = team;
                    data.opposingTeam.leagueId = team.leagueId;
                    $scope.game.teamId = team.id;
                    $scope.game.primaryJerseyColor = $scope.game.primaryJerseyColor || team.primaryJerseyColor;
                    $scope.game.secondaryJerseyColor = $scope.game.secondaryJerseyColor || team.secondaryJerseyColor;
                });
            }
        });

        $scope.$watch('game.opposingTeamId', function(opposingTeamId) {

            if (opposingTeamId) {

                teams.get(opposingTeamId, function(team) {

                    data.opposingTeam = team;
                });
            }
        });

        $scope.$watch('game.isHomeGame', function(isHomeGame) {

            if (isHomeGame) {

                /* Convert isHomeGame boolean to a string for btn-radio directive. */
                $scope.game.isHomeGame = String(isHomeGame);
            }
        });

        var updateGameNotes = function(notes) {

            /* If no coach note exists. */
            if (!notes || !notes.length) {

                $scope.game.notes = $scope.game.notes || [];

                /* Create a new coach note. */
                $scope.game.notes.unshift({
                    noteTypeId: GAME_NOTE_TYPES.COACH_NOTE
                });

                $scope.noteIndex = 0;
            }

            /* If the game is an existing resource with extended methods. */
            if ($scope.game.getIndexOfNoteByType) {

                /* Get the index of the coach note. */
                $scope.noteIndex = $scope.game.getIndexOfNoteByType(GAME_NOTE_TYPES.COACH_NOTE);
            }
        };

        updateGameNotes();

        $scope.$watch('game.notes', updateGameNotes);

        $scope.$watch('formGameInfo.$invalid', function(invalid) {

            tabs['your-team'].disabled = invalid;
        });

        $scope.save = function() {

            /* Convert value from btn-radio back to boolean. */
            $scope.game.isHomeGame = $scope.game.isHomeGame === 'true';
            $scope.game = games.save($scope.game);
            tabs.activateTab('your-team');
        };
    }
]);

