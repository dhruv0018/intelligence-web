import FieldController from '../controller';

class YardFieldController extends FieldController {

    constructor (
        scope,
        playlistEventEmitter,
        EVENT,
        session,
        ROLES,
        plays,
        games,
        teams,
        leagues,
        config
    ) {

        super(
            scope,
            playlistEventEmitter,
            EVENT
        );

        this.session = session;
        this.ROLES = ROLES;
        this.plays = plays;
        this.games = games;
        this.teams = teams;
        this.leagues = leagues;
        this.config = config;

        const currentUser = this.session.getCurrentUser();
        const userIsIndexer = currentUser.is(this.ROLES.INDEXER);

        scope.userIsIndexer = userIsIndexer;

        /**
         * FIXME: Tech Debt
         * Here we parse the DOM to format yard field values to 0-50
         * The real solution is to migrate the field data on the server
         * Remove when it's done. And eat some cake.
         * HOWTO:
         * git blame this comment and revert that commit. Tech debt be gone!
         */
        scope.yardFormatter = this.formatter.bind(this);
    }

    /**
     * Typeahead ng-model formatter
     * @method YardFieldController.formatter
     * @description Converts the yard display value to a 0-100 range
     * for all non-indexers and games whose league is whitelisted
     * @param {Object} availableValue
     * @param {String | Integer} yards
     */
    formatter(availableValue) {

        // field.value.name properties are Strings
        const yards = parseInt(availableValue.name);
        const maxYards = this.config.maxYardsFormat;

        /**
         * The formatter's parameter is ngModel but the return value
         * should be in the same format as typeahead label. Every value
         * must be formatted, so if the business pre-conditions are not
         * met, return the expected, unformatted, typeahead label
         * (field.name | yards)
         */
        if (Number.isNaN(yards) || this.scope.userIsIndexer) return availableValue.name;

        const field = this.scope.field;
        const play = this.plays.get(field.playId);
        const game = this.games.get(play.gameId);
        const team = this.teams.get(game.uploaderTeamId);
        const league = this.leagues.get(team.leagueId);

        const leagueHasFormatting = this.leagues.belongsToYardFormatWhitelist(league);

        this.scope.leagueHasFormatting = leagueHasFormatting;

        return (leagueHasFormatting && (yards > (maxYards/2))) ? (maxYards - yards) : yards;
    }
}

YardFieldController.$inject = [
    '$scope',
    'PlaylistEventEmitter',
    'EVENT',
    'SessionService',
    'ROLES',
    'PlaysFactory',
    'GamesFactory',
    'TeamsFactory',
    'LeaguesFactory',
    'config'
];

export default YardFieldController;
