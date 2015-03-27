/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Play
 * @module Play
 */
var Play = angular.module('Play');

/**
 * Play controller.
 * @module Play
 * @name Play.controller
 * @type {controller}
 */
//TODO far too much DI -- remove some
Play.controller('Play.controller', [
    '$scope', '$state', '$stateParams', '$modal', '$interval', 'ROLES', 'SessionService', 'config', 'TeamsFactory', 'PlayManager', 'IndexingService', 'EventManager', 'VideoPlayer', 'VG_STATES', 'VIEWPORTS', 'GamesFactory',
    function controller($scope, $state, $stateParams, $modal, $interval, ROLES, session, config, teams, playManager, indexing, eventManager, videoPlayer, VG_STATES, VIEWPORTS, games) {

        var currentUser = session.currentUser;

        $scope.VIEWPORTS = VIEWPORTS;
        $scope.game = games.get($scope.play.gameId);

        $scope.isIndexer = currentUser.is(ROLES.INDEXER);
        $scope.isAthlete = currentUser.is(ROLES.ATHLETE);
        $scope.isTeamMember = session.getCurrentTeamId() === $scope.game.uploaderTeamId;

        $scope.playIsInBreakdown = $state.current.name === 'Games.Breakdown';

        $scope.playManager = playManager;

        $scope.videoPlayer = videoPlayer;
        $scope.VG_STATES = VG_STATES;

        $scope.playPlayed = false;

        $scope.reelsActive = config.reels.turnedOn;

        /**
         * Selects this play.
         */
        $scope.selectPlay = function() {

            var play = $scope.play;
            var event = eventManager.current && eventManager.current.time ?
                        eventManager.current : play.events[0];

            /* If the video player is ready. */
            if (videoPlayer.isReady) {

                /* Use the current event time for the video time. */
                var time = event.time;

                /* If the play has been clipped. */
                if (play.clip) {

                    /* Adjust the video time to start time of the play. */
                    time -= play.startTime;

                    /* Get the video sources for the play. */
                    var sources = play.getVideoSources();

                    /* If the play has changed. */
                    if (playManager.current !== play) {

                        /* Change the video player sources. */
                        videoPlayer.changeSource(sources);
                    }
                }

                /* Seek the video player to the appropriate time. */
                videoPlayer.seekTime(time);
            }

            /* Set the current play to match the selected play. */
            playManager.current = play;
        };

        $scope.selectMobileClipPlay = function() {
            $scope.selectPlay();
            if ($state.current.name === 'Clips') {
                $scope.playPlay();
            } else if ($state.current.name === 'ReelsArea') {
                $state.go('Clips', {id: $scope.play.id, reel: $stateParams.id, game: null});
            } else if ($state.current.name.indexOf('Games') > -1) { // Checks for all states with 'Games' in state name string
                $state.go('Clips', {id: $scope.play.id, game: $stateParams.id, reel: null});
            } else {
                $state.go('Clips', {id: $scope.play.id});
            }
        };

        /**
         * Deletes this play.
         */
        $scope.deletePlay = function() {

            $modal.open({

                controller: 'Indexing.Modal.DeletePlay.Controller',
                templateUrl: 'indexing/modal-delete-play.html'

            }).result.then(function() {

                indexing.showTags = true;
                indexing.showScript = false;
                indexing.eventSelected = false;
                indexing.isIndexing = false;

                playManager.remove($scope.play);
            });
        };
    }
]);
