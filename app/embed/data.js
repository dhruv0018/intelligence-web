/* Fetch angular from the browser scope */
var angular = window.angular;

EmbedDataDependencies.$inject = [
    'ReelsFactory',
    'GamesFactory',
    'PlaysFactory'
];

function EmbedDataDependencies (
    reels,
    games,
    plays
) {

    class EmbedData {

        constructor (reelId) {

            /* Load data. */
            this.reel = reels.load(reelId);
            this.games = games.load({reelId: reelId});
            this.plays = plays.load({reelId: reelId});
        }
    }

    return EmbedData;
}

export default EmbedDataDependencies;
