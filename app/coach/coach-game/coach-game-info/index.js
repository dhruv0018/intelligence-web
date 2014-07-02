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
    '$q', '$scope', '$state', 'GAME_TYPES', 'GAME_NOTE_TYPES', 'Coach.Game.Tabs', 'SessionService', 'TeamsFactory', 'LeaguesFactory', 'GamesFactory',
    function controller($q, $scope, $state, GAME_TYPES, GAME_NOTE_TYPES, tabs, session, teams, leagues, games) {
        $scope.session = session;

        $scope.tabs = tabs;

        $scope.todaysDate = Date.now();

        //CONSTANTS
        $scope.GAME_TYPES = GAME_TYPES;
        $scope.GAME_NOTE_TYPES = GAME_NOTE_TYPES;

        //Factories
        $scope.games = games;

        //Collections
        $scope.teams = $scope.data.teams.getCollection();

        //Game Manipulation
        $scope.data.game.notes = $scope.data.game.notes || {};
        $scope.data.game.notes[GAME_NOTE_TYPES.COACH_NOTE] = $scope.data.game.notes[GAME_NOTE_TYPES.COACH_NOTE] || [{noteTypeId: GAME_NOTE_TYPES.COACH_NOTE, content: ''}];
        if (!$scope.data.game.dateplayed) {
            $scope.data.game.dateplayed = Date.now();
        }

        //Opposing Team Construction
        if ($scope.data.game.id) {
            $scope.data.opposingTeam = {
                name:  $scope.teams[$scope.data.game.opposingTeamId].name || ''
            };
        }


        //Headings
        //$scope.setHeadings();


        //watches
        //TODO, we really need to not do this
        $scope.$watch('data.game', function(game) {
            $scope.isHomeGame = $scope.data.game.isHomeGame == 'true' ? true : false;
        });

        $scope.$watch('formGameInfo.$invalid', function(invalid) {
            tabs['your-team'].disabled = invalid;
            tabs['scouting-team'].disabled = invalid;
        });

        //Save functionality
        $scope.save = function() {
            if ($scope.data.game.id) {
                $q.all($scope.saveExisting()).then($scope.goToRoster);
            } else {
                $q.all($scope.constructNewGame()).then($scope.goToRoster);
            }
        };

        $scope.saveExisting = function() {
            var promises = [];

            //Saves the scouting team
            if (!games.isRegular($scope.data.game)) {
                promises.push($scope.teams[$scope.data.game.teamId].save());
            }

            //Saves the opposing team
            promises.push($scope.teams[$scope.data.game.opposingTeamId].save());

            //Saves the game
            promises.push($scope.data.game.save());

            return promises;
        };

        $scope.constructNewGame = function() {
            var promises = {};

            if (!games.isRegular($scope.data.game)) {
                promises.scouting = $scope.constructNewTeam('scouting');
            }

            promises.opposing = $scope.constructNewTeam('opposing');

            $q.all(promises).then(function(promisedData) {

                $scope.data.game.uploaderUserId = session.currentUser.id;
                $scope.data.game.uploaderTeamId = session.currentUser.currentRole.teamId;

                if (games.isRegular($scope.data.game)) {
                    $scope.data.game.teamId = session.currentUser.currentRole.teamId;
                } else {
                    $scope.data.game.teamId = promisedData.scouting.id;
                }

                //Creating Game Rosters
                $scope.data.game.rosters = {};
                $scope.data.game.rosters[$scope.data.game.teamId] = {};
                $scope.data.game.rosters[promisedData.opposing.id] = {};

                return games.extend($scope.data.game).save().then(function(game) {
                    $scope.data.game = game;
                    $scope.data.gamePlayerLists = {};
                    $scope.data.gamePlayerLists[promisedData.opposing.id] = [];
                    $scope.data.gamePlayerLists[$scope.data.game.teamId] = [];
                });
            });
        };

        $scope.constructNewTeam = function(type) {

            if (type === 'opposing') {
                var newOpposingTeam = {
                    isCustomerTeam: false,
                    leagueId: $scope.data.league.id,
                    primaryAwayColor: $scope.isHomeGame ? $scope.data.game.opposingPrimaryColor : null,
                    primaryHomeColor: $scope.isHomeGame ? null : $scope.data.game.opposingPrimaryColor,
                    secondaryAwayColor: $scope.isHomeGame ? $scope.data.game.opposingSecondaryColor : null,
                    secondaryHomeColor: $scope.isHomeGame ? null : $scope.data.game.opposingSecondaryColor
                };
                angular.extend($scope.data.opposingTeam, $scope.data.opposingTeam, newOpposingTeam);
                return teams.save($scope.data.opposingTeam).then(function(opposingTeam) {
                    $scope.data.game.opposingTeamId = opposingTeam.id;
                    return opposingTeam;
                });
            } else if (type === 'scouting') {
                var scoutingTeam = {
                    name: $scope.data.team.name,
                    isCustomerTeam: false,
                    leagueId: $scope.data.league.id,
                    primaryAwayColor: $scope.data.game.primaryJerseyColor,
                    primaryHomeColor: $scope.data.game.primaryJerseyColor,
                    secondaryAwayColor: $scope.data.game.secondaryJerseyColor,
                    secondaryHomeColor: $scope.data.game.secondaryJerseyColor
                };
                angular.extend($scope.data.team, $scope.data.team, scoutingTeam);

                return teams.save($scope.data.team).then(function(scoutingTeam) {
                    $scope.data.game.teamId = scoutingTeam.id;
                    return scoutingTeam;
                });
            }

        };


        $scope.goToRoster = function() {

            if (games.isRegular($scope.data.game)) {
                tabs.activateTab('your-team');
            } else {
                tabs.activateTab('scouting-team');
            }

        };

        $scope.setHeadings = function() {
            $scope.data.headings.opposingTeam = $scope.teams[$scope.data.game.opposingTeamId].name || 'Opposing Team';
            if (games.isRegular($scope.data.game)) {
                $scope.data.headings.team = $scope.teams[$scope.data.game.teamId].name || 'Team';
            } else {
                $scope.data.headings.scoutingTeam = $scope.teams[$scope.data.game.teamId].name || 'Team';
            }
        };

        $scope.$watch('formGameInfo.$invalid', function(invalid) {
            tabs['your-team'].disabled = invalid;
            tabs['scouting-team'].disabled = invalid;
        });

    }
]);

