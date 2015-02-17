var MEDIATION_TIMEOUT = 300;

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

/**
 * @module IntelligenceWebClient
 * @name PlayVideoMediator
 * @type {service}
 */
IntelligenceWebClient.factory('PlayVideoMediator', [
    'EventEmitter', 'Mediator', 'Videoplayer', 'PlayManager',
    function(emitter, Mediator, videoplayer, playManager) {

        /* Create a new mediator to mediate which play should be played next. */
        var mediator = new Mediator(changePlay, compareStartTimes)

        /* Listen for video player "video complete" events. */
        emitter.on('VIDEO_COMPLETE_EMISSION', onCompleteVideo);

        /**
         * A mediator colleague to change the play.
         * @param play {Play} - the play to change to.
         */
        function changePlay(play) {

            /* Set the current play. */
            playManager.current = play;

            /* Get the video sources from the play. */
            var sources = play.getVideoSources();

            /* Change the video player source. */
            videoplayer.changeSource(sources);
        }

        /**
         * A mediator strategy to compare start times.
         */
        function compareStartTimes(a, b) {

            return a.startTime - b.startTime;
        }

        /**
         * When the video completes, setup a timeout to wait for mediation until
         * the plays have had a chance to push themselves into the pool. After
         * the timeout perform mediation and play the winning video.
         */
        function onCompleteVideo() {

            /* Set a timeout to mediate after the video is complete. */
            setTimeout(mediate, MEDIATION_TIMEOUT);

            /* Mediate the plays. */
            function mediate() {

                mediator.flush();
                videoplayer.play();
            }
        }

        return mediator;
    }
]);

