/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'breakdown.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Breakdown
 * @module Breakdown
 */
var Breakdown = angular.module('Breakdown', [
    'Play'
]);

/* Cache the template file */
Breakdown.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Breakdown directive.
 * @module Breakdown
 * @name Breakdown
 * @type {directive}
 */
Breakdown.directive('breakdown', [
    function directive() {

        var Breakdown = {

            restrict: TO += ELEMENTS,

            controller: BreakdownController,

            templateUrl: templateUrl,

            replace: true
        };

        return Breakdown;
    }
]);

/**
* Breakdown controller
*/
BreakdownController.$inject = [
    'PlaysFactory',
    '$scope',
    'EVENT',
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
    'VIDEO_PLAYER_EVENTS'
];

function BreakdownController (
    plays,
    $scope,
    EVENT,
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
    VIDEO_PLAYER_EVENTS
) {

    playsManager.plays = $scope.plays;

    playsManager.calculatePlays();

    $scope.isIndexer = session.currentUser.is(ROLES.INDEXER);
    $scope.showFooter = angular.isUndefined($scope.showFooter) ? true : $scope.showFooter; // Show footer by default
    $scope.showHeader = angular.isUndefined($scope.showHeader) ? true : $scope.showHeader; // Show header by default

    $scope.$on('$destroy', onDestroy);

    /* Retain the current event broker to be an intermediary between the
     * current video time and the current event. */
    currentEventBroker.retain();

    /* Create a new mediator to mediate which play should be played next. */
    var mediator = new Mediator(onMediation, compareStartTimes, matchCriteria);

    /* Listen for video player "video complete" events. */
    VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_CLIP_COMPLETE, onCompleteVideo);

    playlistEventEmitter.on(EVENT.PLAYLIST.PLAY.WATCH, onPlayWatch);
    playlistEventEmitter.on(EVENT.PLAYLIST.EVENT.SELECT, onEventSelect);
    VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_CLIP_COMPLETE, onCompleteVideo);

    function onMediation(play) {

        watchPlay(play);
    }

    function onPlayWatch (play) {

        watchPlay(play);
    }

    function watchPlay (play) {

        const success = () => {
            videoPlayer.seekTime(0);
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

        return videoPlayer.setVideo(play.clip);
    }

    /**
     * A mediator strategy to compare start times.
     */
    function compareStartTimes(a, b) {

        return a.startTime - b.startTime;
    }

    /**
     * Criteria for mediation.
     */
    function matchCriteria (play) {

        return play.clip &&
            play.hasVisibleEvents &&
            play.isFiltered &&
            play.startTime > (playManager.current ? playManager.current.endTime : 0);
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
        playlistEventEmitter.removeListener(EVENT.PLAYLIST.EVENT.SELECT, onEventSelect);
    }
}
