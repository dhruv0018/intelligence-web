/* Fetch angular from the browser scope */
var angular = window.angular;

class ReelData {

    constructor (reelId) {

        /* Get the angular injector for the document. */
        const $injector = angular.element(document).injector();

        /* Get dependencies. */
        const reels = $injector.get('ReelsFactory');
        const games = $injector.get('GamesFactory');
        const teams = $injector.get('TeamsFactory');
        const plays = $injector.get('PlaysFactory');
        const players = $injector.get('PlayersFactory');
        const leagues = $injector.get('LeaguesFactory');
        const tagsets = $injector.get('TagsetsFactory');

        /* Load data. */
        this.tagset = tagsets.load();
        this.leagues = leagues.load();
        this.reel = reels.load(reelId);
        this.games = games.load({reelId: reelId});
        this.teams = teams.load({reelId: reelId});
        this.plays = plays.load({reelId: reelId});
        this.players = players.load({reelId: reelId});
    }
}

export default ReelData;
