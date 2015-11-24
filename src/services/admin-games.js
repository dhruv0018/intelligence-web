import AdminGamesEventEmitter from '../emitters/admin-games';
const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.service('AdminGamesService', AdminGamesService);

AdminGamesService.$inject = [
    'GamesFactory'
];

function AdminGamesService(
    games
) {
    let queryFilter = null;
    let start = null;

    function query() {
        let filter = angular.copy(queryFilter);
        filter.start = start;
        console.log(filter);
        games.query(filter).then(games => {
            AdminGamesEventEmitter.onQueryFinish();
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
