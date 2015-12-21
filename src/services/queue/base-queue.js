import AdminGamesEventEmitter from '../../emitters/admin-games';
const angular = window.angular;

$QueueGamesService.$inject = [
    'GamesFactory',
    'TeamsFactory',
    'UsersFactory',
    '$q',
    'VIEWS'
];

function $QueueGamesService (
    gamesFactory,
    teams,
    users,
    $q,
    VIEWS
) {

    let queryFilter = null;
    let isQuerying = false;
    let start = null;
    let totalCount = null;
    const COUNT_SIZE = VIEWS.QUEUE.GAME.QUERY_SIZE;

    //TODO should belong to indexing game model
    //leaving this open to potentially getting other info from the team besides head coach id
    let extractUserIdsFromTeams = (resolvedTeamChunks) => {
        let headCoachIds = [];
        resolvedTeamChunks.forEach(chunk => {
            let coachIds = chunk.map(team => {
                let headCoachRole = null;
                if (team) {
                    headCoachRole = team.getHeadCoachRole();
                }
                return headCoachRole && headCoachRole.userId ? headCoachRole.userId : null;
            }).filter(id => id !== null);
            headCoachIds = headCoachIds.concat(coachIds);
        });
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
        while (resourceIds.length > 0) {
            let chunk = resourceIds.splice(0, COUNT_SIZE);
            chunks.push(chunk);
        }
        return chunks;
    };

    let success = (games) => {
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
                let query = teams.load(queryParams);
                /* Get the team names */
                teamPromises.push(query);
            }
        });

        return $q.all(teamPromises).then(resolvedTeamChunks => {
            let userIdsFromTeams = extractUserIdsFromTeams(resolvedTeamChunks);
            let userIds = userIdsFromGames.concat(userIdsFromTeams);
            let userChunks = chunkResourcesByIds(userIds);
            let userPromises = [];
            userChunks.forEach(chunk => {
                if (chunk.length > 0) {
                    let queryParams = {
                        'id[]' : chunk
                    };
                    let query = users.load(queryParams);
                    userPromises.push(query);
                }
            });
            return $q.all(userPromises);
        });
    };

    function query() {
        let filter = angular.copy(queryFilter);
        filter.start = start;
        filter.count = COUNT_SIZE;
        let parsedFilter = cleanUpFilter(filter);
        isQuerying = true;
        let totalResultCount = gamesFactory.totalCount(parsedFilter).then(numberOfGames => {
            totalCount = numberOfGames || 0;
        });

        let requestedGames = null;
        if (parsedFilter['id[]']) {
            requestedGames = gamesFactory.fetch(parsedFilter['id[]'], null, () => {
                isQuerying = false;
                AdminGamesEventEmitter.onQueryFinish(null, []);
            });
        } else {
            requestedGames = gamesFactory.query(parsedFilter);
        }
        requestedGames.then(games => {
            games = Array.isArray(games) ? games : [games];
            return success(games).then(() => {
                isQuerying = false;
                AdminGamesEventEmitter.onQueryFinish(null, games);
            });
        });

        return $q.all([totalResultCount, requestedGames]);
    }

    function reset () {

        queryFilter = null;
        start = null;
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
        get isQuerying(){
            return isQuerying;
        },
        get totalCount(){
            return totalCount;
        },
        reset,
        query
    };
}

export default $QueueGamesService;
