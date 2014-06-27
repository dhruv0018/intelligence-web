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
var Info = angular.module('Coach.Game.Info', [
    'ui.bootstrap'
]);

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

                data: '='
            }
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
    '$scope', '$state', '$localStorage', 'GAME_TYPES', 'GAME_NOTE_TYPES', 'Coach.Game.Tabs', 'SessionService', 'TeamsFactory', 'LeaguesFactory', 'GamesFactory',
    function controller($scope, $state, GAME_TYPES, GAME_NOTE_TYPES, tabs, session, teams, leagues, games) {
        $scope.todaysDate = Date.now();

        //CONSTANTS
        $scope.GAME_TYPES = GAME_TYPES;
        $scope.GAME_NOTE_TYPES = GAME_NOTE_TYPES;

        //Factories
        $scope.games = games;

        //Collections
        $scope.teams = $scope.data.teams.getCollection();

        //Opposing Team Construction
        $scope.data.opposingTeam = {
            name:  $scope.teams[$scope.data.game.opposingTeamId].name || ''
        };

        //Headings

//        $scope.saveExistingGame = function() {
//
//        };

//
//        $scope.tabs = tabs;
//        data.then(function(coachData) {
//            $scope.data = coachData;
//
//            //TODO find a better way using the service, not sure why the data isn't being passed forward
//            if (typeof coachData.opposingTeam.name === 'undefined' && coachData.game && coachData.game.id) {
//                teams.get($scope.data.game.opposingTeamId, function(opposingTeam) {
//                    angular.extend($scope.data.opposingTeam, opposingTeam, coachData.opposingTeam);
//                });
//            }
//
//            if (games.isRegular($scope.game)) {
//                $scope.$parent.$parent.headings.yourTeam = coachData.coachTeam.name;
//            }
//        });
//        $scope.$watch('data.opposingTeam.name', function(opposingTeamName) {
//            console.log($scope.data);
//            $scope.data.headings.opposingTeam = opposingTeamName;
//        });
//
//        $scope.$watch('data.team.name', function(teamName) {
//            $scope.data.headings.scoutingTeam = teamName;
//        });
//
//        $scope.$watch('game', function(game) {
//            if (!game.datePlayed) {
//                $scope.game.datePlayed = Date.now();
//            }
//            game.notes = game.notes || {};
//            game.notes[GAME_NOTE_TYPES.COACH_NOTE] = game.notes[GAME_NOTE_TYPES.COACH_NOTE] || [{noteTypeId: GAME_NOTE_TYPES.COACH_NOTE,content: ''}];
//        });
//
//        $scope.$watch('game.isHomeGame', function(isHomeGame) {
//
//            if (isHomeGame) {
//
//                /* Convert isHomeGame boolean to a string for btn-radio directive. */
//                $scope.game.isHomeGame = String(isHomeGame);
//            }
//        });
//
//        $scope.$watch('formGameInfo.$invalid', function(invalid) {
//            tabs['your-team'].disabled = invalid;
//            tabs['scouting-team'].disabled = invalid;
//        });
//

//        $scope.save = function() {
//
//            var game = angular.copy($scope.game);
//
//            var isHomeGame = game.isHomeGame == 'true';
//
//            var newOpposingTeam = {
//                isCustomerTeam: false,
//                leagueId: $scope.data.coachTeam.leagueId,
//                primaryAwayColor: isHomeGame ? game.opposingPrimaryColor : null,
//                primaryHomeColor: isHomeGame ? null : game.opposingPrimaryColor,
//                secondaryAwayColor: isHomeGame ? game.opposingSecondaryColor : null,
//                secondaryHomeColor: isHomeGame ? null : game.opposingSecondaryColor
//            };
//
//            angular.extend($scope.data.opposingTeam, $scope.data.opposingTeam, newOpposingTeam);
//
//            //new game
//            if (typeof game.opposingTeamId === 'undefined') {
//
//                teams.save($scope.data.opposingTeam, function(opposingTeam) {
//                    $scope.data.opposingTeam = opposingTeam;
//                    $scope.data.opposingTeam.players = [];
//
//                    game.opposingTeam = opposingTeam;
//                    game.opposingTeamId = opposingTeam.id;
//
//                    game.rosters = {};
//
//                    if (games.isRegular(game)) {
//                        game.rosters[$scope.data.coachTeam.id] = {};
//                        game.rosters[game.opposingTeamId] = {};
//                        game.teamId = session.currentUser.currentRole.teamId;
//                        game.uploaderUserId = session.currentUser.id;
//                        game.uploaderTeamId = session.currentUser.currentRole.teamId;
//
//                        /* Convert value from btn-radio back to boolean. */
//                        game.isHomeGame = game.isHomeGame === 'true';
//
//                        games.save(game, function(game) {
//                            $scope.game = game;
//                            data.game = game;
//                            tabs.activateTab('your-team');
//                        });
//                    } else {
//
//                        var scoutingTeam = {
//                            name: $scope.data.team.name,
//                            isCustomerTeam: false,
//                            leagueId: $scope.data.coachTeam.leagueId,
//                            primaryAwayColor: game.primaryJerseyColor,
//                            primaryHomeColor: game.primaryJerseyColor,
//                            secondaryAwayColor: game.secondaryJerseyColor,
//                            secondaryHomeColor: game.secondaryJerseyColor
//                        };
//
//                        teams.save(scoutingTeam, function(scoutingTeam) {
//                            $scope.data.team = scoutingTeam;
//                            $scope.data.team.players = [];
//                            $scope.scoutingTeamId = $scope.data.team.id;
//
//                            game.rosters[$scope.data.team.id] = {};
//                            game.rosters[game.opposingTeamId] = {};
//                            game.teamId = $scope.data.team.id;
//                            game.uploaderUserId = session.currentUser.id;
//                            game.uploaderTeamId = session.currentUser.currentRole.teamId;
//
//
//                            games.save(game, function(game) {
//                                $scope.game = game;
//                                data.game = game;
//                                tabs.activateTab('scouting-team');
//                            });
//                        });
//
//                    }
//
//                });
//            } else {
//
//                if (games.isRegular(game)) {
//                    teams.save($scope.data.opposingTeam);
//
//                    games.save(game, function(game) {
//                        $scope.game = game;
//                        data.game = game;
//                        tabs.activateTab('your-team');
//                    });
//                } else {
//                    teams.save($scope.data.opposingTeam, function(opposingTeam) {
//                        teams.save($scope.data.team, function(team) {
//                            games.save(game, function(game) {
//                                $scope.game = game;
//                                data.game = game;
//                                tabs.activateTab('scouting-team');
//                            });
//                        });
//
//                    });
//                }
//
//            }
//
//        };

    }
]);

