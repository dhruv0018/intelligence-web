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
    'EventEmitter', 'Mediator', 'Videoplayer', 'PlayManager', 'EventManager', 'EVENT_MAP',
    function(emitter, Mediator, videoplayer, playManager, eventManager, EVENT_MAP) {

        /* Create a new mediator to mediate which play should be played next. */
        var mediator = new Mediator(changePlay, compareStartTimes);

        /* Listen for video player "video complete" events. */
        emitter.subscribe(EVENT_MAP['clip-completion'], onCompleteVideo);

        /**
         * A mediator colleague to change the play.
         * @param {Play} play - the play to change to.
         */
        function changePlay(play) {

            /* Set the current play. */
            playManager.current = play;
            eventManager.current = play.events[0];

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

            /* Wait for next frame to mediate after the video is complete. */
            requestAnimationFrame(mediate);

            /* Mediate the plays. */
            function mediate() {

                mediator.flush();
                videoplayer.play();
            }
        }

        return mediator;
    }
]);

