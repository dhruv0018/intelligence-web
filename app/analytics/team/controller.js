/* Fetch angular from the browser scope */
const angular = window.angular;
const moment = require('moment');

TeamAnalyticsController.$inject = [
    '$scope',
    '$filter',
    'SessionService',
    'LeaguesFactory',
    'TeamsFactory',
    'GamesFactory',
    'GAME_TYPES',
    'STAT_TYPES'
];

/**
 * Team Analytics page controller
 */
function TeamAnalyticsController(
    $scope,
    $filter,
    session,
    leagues,
    teams,
    games,
    GAME_TYPES,
    STAT_TYPES
) {

    const team = teams.get(session.getCurrentTeamId());
    const league = leagues.get(team.leagueId);
    const seasons = league.seasons.sort((a, b) => moment(b.startDate).diff(a.startDate));

    const generateStats = function () {
        $scope.loadingTables = true;

        const request = team.generateStats($scope.filterQuery);
        request.then(requestHandler);

        function requestHandler(data) {
            // Populate dynamic-tables
            $scope.stats = data;
            $scope.loadingTables = false;
        }
    };

    //Current sport team is associated with
    $scope.sport = team.getSport();
    // Reference to generateStats data response, to populate dynamic-tables
    $scope.stats = {};
    // Available seasons for filters
    $scope.seasons = seasons;
    // Available game types for filters
    $scope.GAME_TYPES = GAME_TYPES;
    // Publish request method as callback on scope
    $scope.generateStats = generateStats;
    // Query parameters for /player/:playerId
    $scope.filterQuery = {
        seasonId: league.seasons[0].id,
        gameType: ''
    };

    $scope.glossary = [];

    games.getStatsGlossary($scope.sport.id,STAT_TYPES.TEAM).then(function(data){
        let arr = data.data;
        let temp = [];

        for(var i=0; i<arr.length; i++) {
            let term = arr[i].attributes;
            temp[term.name] = term.description;
        }

        $scope.glossary = temp;
    });

    // FIXME: Network request in the controller
    // Request team stats for most recent season
    generateStats();
}

export default TeamAnalyticsController;
