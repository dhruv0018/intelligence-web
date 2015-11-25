import AdminGamesEventEmitter from '../emitters/admin-games';
const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.service('AdminGamesService', AdminGamesService);

AdminGamesService.$inject = [
    'GamesFactory',
    'TeamsFactory',
    'UsersFactory',
    '$q'
];

function AdminGamesService(
    games,
    teams,
    users,
    $q
) {
    let queryFilter = null;
    let start = null;
    const COUNT_SIZE = 100;
    //TODO should belong to indexing game model
    //leaving this open to potentially getting other info from the team besides head coach id
    let extractUserIdsFromTeams = (teams) => {
        console.log(teams);
        let headCoachIds = teams.map(team => {
            let headCoachRole = null;
            //why this function doesnt exist on some teams is an enigma
            if (team && team.headCoachRole) {
                let headCoachRole = team.getHeadCoachRole();
            }
            return headCoachRole ? headCoachRole.userId : null;
        }).filter(id => id !== null);
        return headCoachIds;
    };

    //TODO this should belong to an indexing game model
    let extractUserIdsFromGame = (game) => {
        //indexer related ids
        let userIds = game.indexerAssignments.map(assignment => assignment.userId);
        userIds.push(game.uploaderUserId);
        return userIds;
    };

    //TODO this should belong to an indexing game model
    let extractTeamIdsFromGame = (game) => {
        let teamIds = [game.teamId, game.opposingTeamId, game.uploaderTeamId];
        return teamIds;
    };


    //strips out nulls/empty filters
    function cleanUpFilter(filter) {
        let parsedFilter = {};

        Object.keys(filter).forEach(key => {
            let value = filter[key];
            let isNull = value === null;
            let isEmptyString = typeof value === 'string' && value.length === 0;

            //strips out nulls and empty strings
            if (isNull || isEmptyString) return;

            parsedFilter[key] = value;
        });
        return parsedFilter;
    }

    //returns chunks
    let chunkResourcesByIds = (resourceIds) => {
        let chunks = [];
        let numChunks = Math.ceil(resourceIds.length / COUNT_SIZE);
        for (let index = 0; index < numChunks; index++) {
            let start = index === 0 ? 0 : index * COUNT_SIZE;
            chunks[index] = resourceIds.splice(start, COUNT_SIZE);
        }
        return chunks;
    };

    let success = (games) => {
        games = Array.isArray(games) ? games : [games];
        let teamIds = [];
        let teamIdPages = [];
        let userIdsFromGames = [];
        games.forEach(game => {
            teamIds = teamIds.concat(extractTeamIdsFromGame(game));
            userIdsFromGames = userIdsFromGames.concat(extractUserIdsFromGame(game));
        });
        let teamChunks = chunkResourcesByIds(teamIds);
        let teamPromises = [];

        teamChunks.forEach(chunk => {
            if (chunk.length > 0) {
                let queryParams = {
                    'id[]' : chunk
                };
                let query = teams.query(queryParams);
                /* Get the team names */
                teamPromises.push(query);
            }
        });

        $q.all(teamPromises).then(teams => {
            let userIdsFromTeams = extractUserIdsFromTeams(teams);
            let userIds = userIdsFromGames.concat(userIdsFromTeams);
            let userChunks = chunkResourcesByIds(userIds);
            //return users.load(userIds);
            let userPromises = [];
            userChunks.forEach(chunk => {
                if (chunk.length > 0) {
                    let queryParams = {
                        'id[]' : chunk
                    };
                    let query = users.query(queryParams);
                    userPromises.push(query);
                }
            });
            return $q.all(userPromises);
        });
    };

    function query() {
        let filter = angular.copy(queryFilter);
        filter.start = start;
        let parsedFilter = cleanUpFilter(filter);
        return games.query(parsedFilter).then(games => {
            //AdminGamesEventEmitter.onQueryFinish();
            return success(games);
        });
    }

    return {
        get queryFilter() {
            return queryFilter;
        },
        set queryFilter(filter) {
            queryFilter = filter;
        },
        get start() {
            return start;
        },
        set start(offset) {
            start = offset;
        },
        query
    };
}
