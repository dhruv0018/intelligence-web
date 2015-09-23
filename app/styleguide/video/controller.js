class StyleguideCustomController {

    constructor(
        $scope,
        reelsFactory,
        gamesFactory,
        playsFactory,
        playManager,
        playsManager
    ) {

        /*let reelId = 654;
        let reel = reelsFactory.get(reelId);
        let plays = reel.plays.map(mapPlays);
        let play = plays[0];
        let game = gamesFactory.get(plays[0].gameId);
        $scope.reel = reel;
        $scope.plays = plays;
        $scope.playManager = playManager;
        $scope.video = plays[0].clip;
        $scope.currentPlayId = play.id;

        playManager.current = play;

        $scope.posterImage = {
            url: game.video.thumbnail
        };

        function mapPlays (playId, index) {

            let play = playsFactory.get(playId);

            return play;
        }*/
    }
}

StyleguideCustomController.$inject = [
    '$scope',
    'ReelsFactory',
    'GamesFactory',
    'PlaysFactory',
    'PlayManager',
    'PlaysManager'
];

export default StyleguideCustomController;
