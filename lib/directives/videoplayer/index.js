/* Constants */
var TO = '';
var ELEMENTS = 'E';
var ATTRIBUTES = 'A';

/* Fetch angular from the browser scope */
var angular = window.angular;

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
    'com.2fdevs.videogular.plugins.poster'
]);

/* Cache the template file */
Videoplayer.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('videoplayer.html', require('./template.html'));
        $templateCache.put('krossover-play-pause-button.html', require('./krossover-play-pause-button.html'));
        $templateCache.put('krossover-jump-forward-button.html', require('./krossover-jump-forward-button.html'));
        $templateCache.put('krossover-fast-forward-button.html', require('./krossover-fast-forward-button.html'));
        $templateCache.put('krossover-jump-backward-button.html', require('./krossover-jump-backward-button.html'));
        $templateCache.put('krossover-fast-backward-button.html', require('./krossover-fast-backward-button.html'));
        $templateCache.put('krossover-full-screen-button.html', require('./krossover-full-screen-button.html'));
        $templateCache.put('krossover-mute-button.html', require('./krossover-mute-button.html'));

        /* Videogular template files */
        $templateCache.put('views/videogular/plugins/buffering/buffering.html', require('./buffering.html'));
        $templateCache.put('views/videogular/plugins/controls/volume-bar.html', require('./volume-bar.html'));
        $templateCache.put('views/videogular/plugins/controls/controls.html', require('./controls.html'));
    }
]);

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
    '$sce',
    function($sce) {

        var directive = {
            scope: {
                sources: '=',
                playStartTime: '=',
                playEndTime: '=',
                videoWidthOverride: '=?overrideWidth',
                videoHeightOverride: '=?overrideHeight'
            },
            restrict: TO += ELEMENTS,
            link: link,
            controller: 'Videoplayer.controller',
            templateUrl: 'videoplayer.html'
        };

        function link($scope, element, attributes) {
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
    '$rootScope', 'config', '$scope', '$state', '$sce', '$modal', 'VideoPlayerInstance', 'PlayManager', 'EventManager', 'VG_STATES', 'DEVICE',
    function controller($rootScope, config, $scope, $state, $sce, $modal, videoPlayerInstance, playManager, eventManager, VG_STATES, DEVICE) {

        var videoPlayer = videoPlayerInstance.promise;

        var currentClipTime = 0;
        var self = this;

        $scope.state = null;
        $scope.volume = 1;
        $scope.isCompleted = false;
        $scope.VG_STATES = VG_STATES;
        $scope.playManager = playManager;
        $scope.played = false;

        $scope.clipStartTime = $scope.playStartTime;
        $scope.clipEndTime = $scope.playEndTime;

        $scope.isMobile = ($rootScope.DEVICE === DEVICE.MOBILE);

        $scope.config = {
            autoHide: false,
            autoPlay: false,
            responsive: true,
            transclude: false
        };

        if (playManager.videoTitle === 'rawFilm' || playManager.videoTitle === 'indexing' || playManager.videoTitle === 'reelsPlayer') {
            $scope.clipStartTime = $scope.playStartTime || 0;

            videoPlayer.then(function(vp) {
                $scope.$watch('mediaElement.duration', function(newDuration) {
                    if (newDuration) $scope.clipEndTime = newDuration;
                });
            });
        }

        $scope.$on('$destroy', function() {
            videoPlayer.then(function(vp) {
                vp.pause();
                vp.clearSources();
            });

            playManager.clear();
            eventManager.reset();
            delete playManager.videoTitle;
        });

        function updateMediaFragment(newClipTime) {

            if (newClipTime) {
                $scope.mediaFragmentURI = '#t=' + $scope.clipStartTime + ',' + $scope.playEndTime;
            } else {
                $scope.mediaFragmentURI = '';
            }

            videoPlayer.then(function(vp) {
                if (vp && vp.mediaElement && vp.mediaElement.length && vp.mediaElement[0].src) vp.mediaElement[0].src = vp.mediaElement[0].src.split('#')[0] + $scope.mediaFragmentURI;
            });
        }

        $scope.$watch('clipStartTime', updateMediaFragment);
        $scope.$watch('playEndTime', function(newPlayEndTime) {
            $scope.clipEndTime = newPlayEndTime;
            $scope.isCompleted = false;
        });

        $scope.$watch(function() { return (event && event.current && event.current.time) ? event.current.time : 0; }, function(newClipTime) {
            $scope.clipStartTime = newClipTime;
        });

        $scope.buildSrcUri = function(source) {

            var uri = source.src + $scope.mediaFragmentURI;

            return $sce.trustAsResourceUri(uri);
        };

        $scope.onPlayerReady = function(API) {

            self.API = API;
            API.mediaElement.one('canplay', function() {
                $scope.mediaElement = API.mediaElement[0]; //for video buttons
                API.getCurrentTime = function() {
                    return $scope.mediaElement.currentTime;
                };
                videoPlayerInstance.resolve(API);
            });
        };

        function playNextPlay() {
            var nextPlayScope = playManager.getNextPlayScope();
            if (nextPlayScope) {
                nextPlayScope.selectPlay();
                nextPlayScope.playPlay();
            }

            return nextPlayScope;
        }

        $scope.onCompleteVideo = function() {

            if (playManager.videoTitle === 'reelsPlayer' && playManager.playAllPlays) {
                playNextPlay();
                return;
            }

            playManager.playState = VG_STATES.STOP;
            $scope.isCompleted = true;
            $scope.$apply();
        };

        $scope.onUpdateState = function(state) {

            $scope.state = state;
            playManager.playState = state;

            if (state === VG_STATES.PLAY) {
                $scope.isCompleted = false;
                $scope.played = true;
            }

        };

        $scope.onUpdateTime = function(currentTime, endTime) {

            currentClipTime = currentTime;

            if (self.API) {
                self.API.setTimeDisplay(currentTime - ($scope.playStartTime || 0));
                $scope.$apply();
            }

            if ($scope.playEndTime && currentTime > $scope.playEndTime) {

                videoPlayer.then(function(vp) {
                    vp.pause();
                    eventManager.highlighted = null;

                    if (!playManager.playAllPlays) {
                        vp.seekTime($scope.playStartTime);
                    } else {
                        playNextPlay();
                    }
                    $scope.isCompleted = true;
                });
            } else if ($scope.playStartTime && currentTime < $scope.playStartTime) {
                videoPlayer.then(function(vp) {
                    vp.seekTime($scope.playStartTime);
                });
            }

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

Videoplayer.directive('krossoverPlayPauseButton', [
    'config', 'VG_EVENTS', 'VG_STATES',
    function(config, VG_EVENTS, VG_STATES) {

        return {

            restrict: TO += ELEMENTS + ATTRIBUTES,
            require: '^videogular',
            scope: false,

            controller: function($scope) {

                $scope.VG_STATES = VG_STATES;
                $scope.currentState = VG_STATES.STOP;
            },

            link: function($scope, element, attribute, API) {

                function onChangeState(target, params) {

                    $scope.currentState = params[0];
                }

                function onClickPlayPause() {

                    API.playPause();
                    $scope.$apply();
                }

                element.bind('click', onClickPlayPause);

                API.$on(VG_EVENTS.ON_SET_STATE, onChangeState);
            }
        };
    }
]);

Videoplayer.directive('krossoverMuteButton', [
    'config', 'VG_EVENTS',
    function(config, VG_EVENTS) {

        return {

            restrict: TO += ELEMENTS,
            require: '^videogular',
            templateUrl: 'krossover-mute-button.html',

            controller: function($scope) {

                /* NOTE: Uses FontAwesome icon classes. */
                $scope.muteIcon = 'icon icon-volume-off';
                $scope.volumeLevel0Icon = 'icon icon-volume-down';
                $scope.volumeLevel1Icon = 'icon icon-volume-down';
                $scope.volumeLevel2Icon = 'icon icon-volume-down';
                $scope.volumeLevel3Icon = 'icon icon-volume-up';
                $scope.currentIcon = $scope.volumeLevel3Icon;
            },

            link: function($scope, element, attributes, API) {

                $scope.defaultVolume = 1;
                $scope.currentVolume = $scope.defaultVolume;

                function onClickMute(event) {

                    if ($scope.currentIcon === $scope.muteIcon) {

                        $scope.currentVolume = $scope.defaultVolume;

                    } else {

                        $scope.currentVolume = 0;
                        $scope.currentIcon = $scope.muteIcon;
                    }

                    API.setVolume($scope.currentVolume);
                }

                function onSetVolume(target, params) {

                    var volume = params[0];

                    $scope.currentVolume = volume;

                    /* If not muted. */
                    if ($scope.currentIcon !== $scope.muteIcon) {

                        $scope.defaultVolume = volume;
                    }

                    /* If muted, but the user changed the volume. */
                    else if (volume > 0) {

                        $scope.defaultVolume = volume;
                    }

                    var percentValue = Math.round(volume * 100);

                    if (percentValue === 0) {

                        $scope.currentIcon = $scope.muteIcon;
                    }
                    else if (percentValue > 0 && percentValue < 25) {

                        $scope.currentIcon = $scope.volumeLevel0Icon;
                    }
                    else if (percentValue >= 25 && percentValue < 50) {

                        $scope.currentIcon = $scope.volumeLevel1Icon;
                    }
                    else if (percentValue >= 50 && percentValue < 75) {

                        $scope.currentIcon = $scope.volumeLevel2Icon;
                    }
                    else if (percentValue >= 75) {

                        $scope.currentIcon = $scope.volumeLevel3Icon;
                    }

                    $scope.$apply();
                }

                element.bind('click', onClickMute);

                API.$on(VG_EVENTS.ON_SET_VOLUME, onSetVolume);
            }
        };
    }
]);

Videoplayer.directive('krossoverFullscreenButton', [
    'VG_EVENTS',
    function(VG_EVENTS) {

        return {

            restrict: TO += ELEMENTS + ATTRIBUTES,
            require: '^videogular',
            templateUrl: 'krossover-full-screen-button.html',
            scope: true,

            link: function($scope, element, attribute, API) {

                function onEnterFullScreen() {

                    $scope.fullscreen = true;
                    $scope.$apply();
                }

                function onExitFullScreen() {

                    $scope.fullscreen = false;
                }

                function onClickFullScreen(event) {

                    API.toggleFullScreen();
                    $scope.$apply();
                }

                element.bind('click', onClickFullScreen);

                API.$on(VG_EVENTS.ON_ENTER_FULLSCREEN, onEnterFullScreen);
                API.$on(VG_EVENTS.ON_EXIT_FULLSCREEN, onExitFullScreen);
            }
        };
    }
]);
