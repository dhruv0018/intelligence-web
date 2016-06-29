/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'playlist.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Playlist
 * @module Playlist
 */
var Playlist = angular.module('Playlist', [
    'Play',
    'ui.bootstrap',
    'ng'
]);

/* Cache the template file */
Playlist.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Playlist directive.
 * @module Playlist
 * @name Playlist
 * @type {directive}
 */
Playlist.directive('krossoverPlaylist', [
    function directive() {

        var Playlist = {

            restrict: TO += ELEMENTS,

            controller: PlaylistController,
            controllerAs: 'playListController',
            templateUrl: templateUrl,

            replace: true,
            link: {
                pre: function() {
                },
                post: function(scope, element) {
                }
            }
        };

        return Playlist;
    }
]);

/**
* Playlist controller
*/
PlaylistController.$inject = [
    'PlaysFactory',
    '$scope',
    'EVENT',
    'VIDEO_PLAYER_EVENTS',
    'ROLES',
    'Mediator',
    'CurrentEventBroker',
    'PlaylistEventEmitter',
    'VideoPlayerEventEmitter',
    'VideoPlayer',
    'SessionService',
    'PlaysManager',
    'PlayManager',
    'EventManager',
    'GamesFactory'
];

function PlaylistController (
    plays,
    $scope,
    EVENT,
    VIDEO_PLAYER_EVENTS,
    ROLES,
    Mediator,
    currentEventBroker,
    playlistEventEmitter,
    VideoPlayerEventEmitter,
    videoPlayer,
    session,
    playsManager,
    playManager,
    eventManager,
    games
) {

    playsManager.plays = $scope.plays;

    $scope.isIndexer = session.currentUser.is(ROLES.INDEXER);
    $scope.showFooter = angular.isUndefined($scope.showFooter) ? true : $scope.showFooter; // Show footer by default
    $scope.showHeader = angular.isUndefined($scope.showHeader) ? true : $scope.showHeader; // Show header by default

    $scope.getPlayCount = function getPlayCount() {
        if ($scope.filteredPlaysIds) {
            return $scope.filteredPlaysIds.length;
        } else {
            return $scope.plays.length;
        }
    };

    $scope.$on('$destroy', onDestroy);

    /* Retain the current event broker to be an intermediary between the
     * current video time and the current event. */
    currentEventBroker.retain();

    /* Create a new mediator to mediate which play should be played next. */
    var mediator = new Mediator(onMediation, compareIndices, matchCriteria);

    /* Listen for video player "video complete" events. */
    VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_CLIP_COMPLETE, onCompleteVideo);
    VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_FRAGMENT_END, onCompleteVideo);

    playlistEventEmitter.on(EVENT.PLAYLIST.PLAY.WATCH, onPlayWatch);
    playlistEventEmitter.on(EVENT.PLAYLIST.EVENT.SELECT, onEventSelect);

    function onMediation(play) {

        watchPlay(play);
    }

    function onPlayWatch (play) {

        watchPlay(play);
    }

    function watchPlay (play) {

        const success = () => {
            if (!play.isSelfEdited) {
                videoPlayer.seekTime(0);
            }
            videoPlayer.play();
        };

        const fail = () => {
            onCompleteVideo();
        };

        changePlay(play).then(success, fail);
    }

    function onEventSelect (event) {

        let play = plays.get(event.playId);
        let wasPlaying = videoPlayer.currentState === 'play';

        const success = () => {
            let videoTime = play.getEventsRelativeTime(event);
            videoPlayer.seekTime(videoTime);

            if (wasPlaying) videoPlayer.play();
        };

        const fail = () => {
            onCompleteVideo();
        };

        changePlay(play).then(success, fail);
    }

    /**
     * A mediator colleague to change the play.
     * @param {Play} play - the play to change to.
     */
    function changePlay(play) {

        /* Set the current play. */
        playManager.current = play;

        if (!play.isSelfEdited) {
            return videoPlayer.setVideo(play.clip);
        }

        let game = games.get(play.gameId);

        return videoPlayer.setVideoFragment(game.video, play.startTime, play.endTime);
    }

    /**
     * A mediator strategy to compare start times.
     */
    function compareIndices(a, b) {

        return playsManager.plays.indexOf(a) - playsManager.plays.indexOf(b);
    }

    /**
     * Criteria for mediation.
     */
    function matchCriteria (play) {

        return playsManager.plays.indexOf(play) > (playManager.current ? playsManager.plays.indexOf(playManager.current) : 0);
    }

    /**
     * When the video completes, perform mediation and play the winning video.
     */
    function onCompleteVideo() {

        /* If continuous play is on. */
        if (playManager.playAllPlays) {

            /* Put each play into pool of plays that should be played next. */
            $scope.plays.forEach(mediator.push.bind(mediator));

            /* Mediate the plays. */
            mediator.flush();
        }
    }

    function onDestroy() {

        currentEventBroker.resign();
        playlistEventEmitter.removeListener(EVENT.PLAYLIST.PLAY.WATCH, onPlayWatch);
        VideoPlayerEventEmitter.removeListener(VIDEO_PLAYER_EVENTS.ON_CLIP_COMPLETE, onCompleteVideo);
        VideoPlayerEventEmitter.removeListener(VIDEO_PLAYER_EVENTS.ON_FRAGMENT_END, onCompleteVideo);
        playlistEventEmitter.removeListener(EVENT.PLAYLIST.EVENT.SELECT, onEventSelect);
    }
}
