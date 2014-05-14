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

        data.then(function(coachData) {
            $scope.data = coachData;
            console.log(coachData);

            //TODO find a better way using the service, not sure why the data isn't being passed forward
            if (typeof coachData.opposingTeam.name === 'undefined') {
                teams.get($scope.data.game.opposingTeamId, function(opposingTeam){
                   $scope.data.opposingTeam.name = opposingTeam.name;
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
                    noteTypeId: GAME_NOTE_TYPES.COACH_NOTE,
                    content: ''
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

            var game = angular.copy($scope.game);

            var isHomeGame = game.isHomeGame == 'true';

            var newOpposingTeam = {
                isCustomerTeam: false,
                leagueId: $scope.data.team.leagueId,
                primaryAwayColor: isHomeGame ? game.opposingPrimaryColor : null,
                primaryHomeColor: isHomeGame ? null : game.opposingPrimaryColor,
                secondaryAwayColor: isHomeGame ? game.opposingSecondaryColor : null,
                secondaryHomeColor: isHomeGame ? null : game.opposingSecondaryColor
            };

            angular.extend($scope.data.opposingTeam, $scope.data.opposingTeam, newOpposingTeam);

            if(typeof game.opposingTeamId === 'undefined'){
                teams.save($scope.data.opposingTeam, function(opposingTeam) {

                    game.opposingTeam = opposingTeam;
                    game.opposingTeamId = opposingTeam.id;

                    game.rosters = {};
                    game.rosters[$scope.data.team.id] = {};
                    game.rosters[game.opposingTeamId] = {};

                    game.teamId = session.currentUser.currentRole.teamId;
                    game.uploaderUserId = session.currentUser.id;
                    game.uploaderTeamId = session.currentUser.currentRole.teamId;

                    /* Convert value from btn-radio back to boolean. */
                    game.isHomeGame = game.isHomeGame === 'true';

                    games.save(game, function(game) {
                        $scope.game = game;
                        data.game = game;
                        tabs.activateTab('your-team');
                    });

                });
            } else {
                games.save(game, function(game) {
                    $scope.game = game;
                    data.game = game;
                    tabs.activateTab('your-team');
                });
            }


        };
    }
]);

