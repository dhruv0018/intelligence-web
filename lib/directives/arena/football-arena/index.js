/* Component dependencies */
require('football-field-section');
require('football-field-line-of-scrimmage');
require('football-field-formation');

/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'arena/football/template.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FootballArena
 * @module FootballArena
 */
var FootballArena = angular.module('Arena.Football', [
    'Arena.Football.FootballFieldSection',
    'Arena.Football.FootballFieldLineOfScrimmage',
    'Arena.Football.FootballFieldFormation'
]);

/* Cache the template file */
FootballArena.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * FootballArena directive.
 * @module FootballArena
 * @name FootballArena
 * @type {Directive}
 */
FootballArena.directive('krossoverArenaFootballField', [
    function directive() {

        var FootballArena = {

            restrict: TO += ELEMENTS,

            scope: {
                chart: '=',
                redzone: '='
            },

            controller: 'Arena.Football.controller',

            templateUrl: templateUrl
        };

        return FootballArena;
    }
]);


FootballArena.controller('Arena.Football.controller', [
    '$scope', 'ZONE_AREAS', 'ZONES', 'TeamsFactory', 'GamesFactory', 'PlaysFactory', 'LeaguesFactory', 'PlayersFactory', '$stateParams',
    function controller($scope, ZONE_AREAS, ZONES, teams, games, plays, leagues, players, $stateParams) {

        $scope.ZONE_AREAS = ZONE_AREAS;
        $scope.LOSS_ZONES = ZONE_AREAS.LOSS_ZONES;
        $scope.FLAT_ZONES = ZONE_AREAS.FLAT_ZONES;
        $scope.FORWARD_ZONES = ZONE_AREAS.FORWARD_ZONES;
        $scope.DEEP_ZONES = ZONE_AREAS.DEEP_ZONES;

        //Collections
        $scope.teams = teams.getCollection();

        //Game Related
        $scope.game = games.get($stateParams.id);

        //Team Related
        $scope.teamId = $scope.game.teamId;
        $scope.opposingTeamId = $scope.game.opposingTeamId;
        var team = teams.get($scope.teamId);

        //Play Related
        $scope.plays = plays.getList({ gameId: $scope.game.id });

        //League Related
        $scope.league = leagues.get(team.leagueId);

        var teamPlayersFilter = { rosterId: $scope.game.getRoster($scope.teamId).id };
        $scope.teamPlayers = players.getList(teamPlayersFilter);

        var opposingTeamPlayersFilter = { rosterId: $scope.game.getRoster($scope.opposingTeamId).id };
        $scope.opposingTeamPlayers = players.getList(opposingTeamPlayersFilter);
    }
]);
