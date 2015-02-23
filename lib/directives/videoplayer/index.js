/* Constants */
var TO = '';
var ELEMENTS = 'E';
var ATTRIBUTES = 'A';

/* Fetch angular from the browser scope */
var angular = window.angular;
require('cuepoints');

/**
 * Videoplayer module.
 * @module Videoplayer
 */
var Videoplayer = angular.module('videoplayer', [
    'ui.router',
    'ui.bootstrap',
    'com.2fdevs.videogular',
    'com.2fdevs.videogular.plugins.controls',
    'com.2fdevs.videogular.plugins.overlayplay',
    'com.2fdevs.videogular.plugins.poster',
    'koi-cue-points'
]);

/* Cache the template file */
Videoplayer.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('videoplayer.html', require('./template.html'));

        /* Custom controls templates. */
        $templateCache.put('krossover-jump-forward-button.html', require('./krossover-jump-forward-button.html'));
        $templateCache.put('krossover-fast-forward-button.html', require('./krossover-fast-forward-button.html'));
        $templateCache.put('krossover-jump-backward-button.html', require('./krossover-jump-backward-button.html'));
        $templateCache.put('krossover-fast-backward-button.html', require('./krossover-fast-backward-button.html'));

        /* Videogular templates */
        $templateCache.put('vg-templates/vg-play-pause-button', require('./krossover-play-pause-button.html'));
        $templateCache.put('vg-templates/vg-overlay-play', require('./krossover-overlay-play.html'));
    }
]);

/* TODO: Remove constant. */
Videoplayer.constant('VG_CONFIG', {
    MIN_PARENT_HEIGHT: 50, // min height for parent of video player to be used for determining videos height
    ASPECT_RATIO: 16 / 9,
    CONTROLS_HEIGHT: 60, //Not loaded at this point, so need to hardcode
});

/* TODO: Remove VG_EVENTS constant. No longer needed, but relied on. */
Videoplayer.constant('VG_EVENTS', {
    ON_PLAY: 'onVgPlay',
    ON_PAUSE: 'onVgPause',
    ON_PLAY_PAUSE: 'onVgPlayPause',
    ON_START_PLAYING: 'onVgStartPlaying',
    ON_COMPLETE: 'onVgComplete',
    ON_SET_STATE: 'onVgSetState',
    ON_SET_VOLUME: 'onVgSetVolume',
    ON_TOGGLE_FULLSCREEN: 'onVgToggleFullscreen',
    ON_ENTER_FULLSCREEN: 'onVgEnterFullscreen',
    ON_EXIT_FULLSCREEN: 'onVgExitFullscreen',
    ON_BUFFERING: 'onVgBuffering',
    ON_UPDATE_TIME: 'onVgUpdateTime',
    ON_SEEK_TIME: 'onVgSeekTime',
    ON_UPDATE_SIZE: 'onVgUpdateSize',
    ON_PLAYER_READY: 'onVgPlayerReady',
    ON_LOAD_POSTER: 'onVgLoadPoster',
    ON_ERROR: 'onVgError'
});

Videoplayer.value('Videoplayer', {});

Videoplayer.factory('VideoPlayerInstance', [
    '$q',
    function($q) {
        this.defer = $q.defer();
        var oldReject = this.defer.reject;
        this.defer.reject = function(reason) {
            oldReject(reason);
            this.defer = $q.defer();
        };
        return this.defer;

    }
]);

/**
 * Videoplayer directive.
 * @module Videoplayer
 * @name KrossoverVideoplayer
 * @type {Directive}
 */
Videoplayer.directive('krossoverVideoplayer', [
    '$sce', 'EventEmitter', 'EVENT_MAP',
    function($sce, emitter, EVENT_MAP) {

        var directive = {
            scope: {
                sources: '=',
                playStartTime: '=',
                playEndTime: '=',
                videoWidthOverride: '=?overrideWidth',
                videoHeightOverride: '=?overrideHeight',
                film: '=',
                posterImage: '='
            },
            restrict: TO += ELEMENTS,
            link: link,
            controller: 'Videoplayer.controller',
            templateUrl: 'videoplayer.html'
        };

        function link(scope, element, attributes, controller) {
            var videoPlayer = element.find('video')[0];

            //3 second wait
            var telestrationDelayUntilResumePlaying = 3000;

            videoPlayer.addEventListener('timeupdate', function(e) {
                emitter.register(e);
            });

            videoPlayer.addEventListener('canplay', function(e) {
                emitter.register(e);
            });

            var handler = function(e) {
                //if you aren't able to edit the telestrations, then resume playing after a short delay
                videoPlayer.pause();
                if (!scope.allowTelestrationEditing) {
                    $timeout(scope.onClickPlayPause, telestrationDelayUntilResumePlaying);
                }
            };

            videoPlayer.addEventListener('play', function(e) {
                emitter.register(e);
            });

            videoPlayer.addEventListener('seeking', function(e) {
                emitter.register(e);
            });

            videoPlayer.addEventListener('pause', function(e) {
                emitter.register(e);
            });

            emitter.subscribe(EVENT_MAP['stopvideo'], handler);

        }

        return directive;
    }
]);

/**
 * Videoplayer controller.
 * @module Videoplayer
 * @name Videoplayer.controller
 * @type {controller}
 */
Videoplayer.controller('Videoplayer.controller', [
    '$window', '$element', '$rootScope', 'config', '$scope', '$state', '$sce', '$modal', 'vgFullscreen', 'Videoplayer', 'VideoPlayerInstance', 'PlayManager', 'EventManager', 'EventEmitter', 'VG_CONFIG', 'VG_STATES', 'DEVICE', 'ROLES',
    function controller($window, $element, $rootScope, config, $scope, $state, $sce, $modal, vgFullscreen, videoplayer, videoPlayerInstance, playManager, eventManager, emitter, VG_CONFIG, VG_STATES, DEVICE, ROLES) {

        var videoPlayer = videoPlayerInstance.promise;

        var currentClipTime = 0;
        var self = this;

        $scope.allowTelestrationEditing = function allowTelestrationEditing(film) {
            var currentUser = session.getCurrentUser();
            return currentUser.id === film.uploaderUserId || currentUser.currentRole.teamId === film.uploaderTeamId && currentUser.is(ROLES.COACH);
        };

        $scope.state = null;
        $scope.volume = 1;
        $scope.VG_STATES = VG_STATES;
        $scope.playManager = playManager;

        $scope.isMobile = ($rootScope.DEVICE === DEVICE.MOBILE);

        $scope.config = {
            autohide: true,
            autoPlay: false,
            responsive: true,
            transclude: false
        };

        $scope.onPlayerReady = function(API) {

            self.API = API;
            angular.extend(videoplayer, API);
            API.mediaElement.one('canplay', function() {
                videoPlayerInstance.resolve(API);
            });
        };

        $scope.onCompleteVideo = function() {
            emitter.register(new Event('clip-completion'));
        };

        $scope.onUpdateState = function(state) {

            $scope.state = state;
        };

        $scope.onChangeSource = function(source) {

            $scope.sources = source;
        };

        $scope.onUpdateTime = function(currentTime, duration) {

        };

        $scope.onUpdateVolume = function(volume) {

            $scope.volume = volume;
        };

        $scope.onClickPlayPause = function onClickPlayPause() {
            /* Set the play rate to play normal. */
            videoPlayer.then(function(vp) {
                vp.mediaElement[0].playbackRate = 1.0;

                if ($scope.isCompleted) {
                    vp.seekTime($scope.playStartTime);
                    vp.play();
                } else {
                    vp.playPause();
                }
            });
        };

        $scope.onClickFastBackward = function onClickFastBackward() {
            videoPlayer.then(function(vp) {
                vp.seekTime(currentClipTime - 3);
                vp.mediaElement[0].playbackRate = 1;

                //reset highlighting since jumping backwards
                eventManager.highlighted = null;
            });
        };

        $scope.onClickFastForward = function onClickFastForward() {
            videoPlayer.then(function(vp) {
                vp.mediaElement[0].playbackRate = (vp.mediaElement[0].playbackRate !== 1) ? 1 : 3.0;
            });
        };

        $scope.onClickJumpBackward = function onClickJumpBackward() {
            videoPlayer.then(function(vp) {
                vp.seekTime(currentClipTime - 1);
                vp.mediaElement[0].playbackRate = 1;

                //reset highlighting since jumping backwards
                eventManager.highlighted = null;
            });
        };

        $scope.onClickJumpForward = function onClickJumpForward() {
            videoPlayer.then(function(vp) {
                vp.mediaElement[0].playbackRate = (vp.mediaElement[0].playbackRate !== 1) ? 1 : 0.25;
            });
        };
    }
]);

