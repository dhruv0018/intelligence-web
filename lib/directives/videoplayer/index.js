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
    'Videogular'
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
    '$q', 'VG_EVENTS',
    function($q, VG_EVENTS) {

        this.deferred = this.deferred || $q.defer();

        return {
            then: this.deferred.promise.then,
            resolve: this.deferred.resolve,
            reject: function() {
                delete this.deferred;
                this.deferred = $q.defer();
            }
        };

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
                videoTitle: '='
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
    'config', 'package', '$scope', '$state', '$sce', '$modal', 'VideoPlayerInstance', 'PlayManager', 'EventManager', 'VG_STATES',
    function controller(config, package, $scope, $state, $sce, $modal, videoPlayer, playManager, eventManager, VG_STATES) {

        $scope.currentTime = 0;
        $scope.totalTime = 0;
        $scope.state = null;
        $scope.volume = 1;
        $scope.isCompleted = false;
        $scope.VG_STATES = VG_STATES;

        $scope.clipStartTime = $scope.playStartTime;
        $scope.clipEndTime = $scope.playEndTime;

        if ($scope.videoTitle === 'rawFilm' || $scope.videoTitle === 'indexing') {
            $scope.clipStartTime = $scope.playStartTime || 0;

            videoPlayer.then(function(vp) {
                $scope.$watch('videoElement.duration', function(newDuration) {
                    if (newDuration && !$scope.clipEndTime) $scope.clipEndTime = newDuration;
                });
            });
        }

        $scope.$on('$destroy', function() {
            videoPlayer.then(function(vp) {
                vp.pause();
            });

            playManager.clear();
            eventManager.reset();
        });

        function updateMediaFragment(newClipTime) {

            if (newClipTime) {
                $scope.mediaFragmentURI = '#t=' + $scope.clipStartTime + ',' + $scope.playEndTime;
            } else {
                $scope.mediaFragmentURI = '';
            }

            videoPlayer.then(function(vp) {
                if (vp && vp.videoElement && vp.videoElement.length && vp.videoElement[0].src) vp.videoElement[0].src = vp.videoElement[0].src.split('#')[0] + $scope.mediaFragmentURI;
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

            API.videoElement.one('canplay', function() {
                $scope.videoElement = API.videoElement[0]; //for video buttons
                videoPlayer.resolve(API);
            });
        };

        $scope.onCompleteVideo = function() {

            $scope.isCompleted = true;
        };

        $scope.onUpdateState = function(state) {

            $scope.state = state;
            playManager.playState = state;

            if (state === VG_STATES.PLAY) {
                $scope.isCompleted = false;
            }
        };

        $scope.onUpdateTime = function(currentTime, endTime) {

            $scope.currentClipTime = currentTime;

            if ($scope.playEndTime && currentTime > $scope.playEndTime) {

                videoPlayer.then(function(vp) {
                    vp.pause();
                    eventManager.highlighted = null;
                    vp.seekTime($scope.playStartTime);
                    $scope.isCompleted = true;
                });
            } else if ($scope.playStartTime && currentTime < $scope.playStartTime) {
                videoPlayer.then(function(vp) {
                    vp.seekTime($scope.playStartTime);
                });
            }

            $scope.$apply();
        };

        $scope.onUpdateVolume = function(volume) {

            $scope.volume = volume;
        };

        $scope.stretchModes = [

            { label: 'None', value: 'none' },
            { label: 'Fit',  value: 'fit' },
            { label: 'Fill', value: 'fill' }
        ];

        $scope.config = {
            width: 740,
            height: 380,
            autoHide: false,
            autoPlay: false,
            responsive: true,
            transclude: false,
            stretch: $scope.stretchModes[2],
        };

        $scope.onClickPlayPause = function onClickPlayPause() {

            /* Set the play rate to play normal. */
            videoPlayer.then(function(vp) {
                vp.videoElement[0].playbackRate = 1.0;

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
                vp.seekTime($scope.currentClipTime - 3);
                vp.videoElement[0].playbackRate = 1;

                //reset highlighting since jumping backwards
                eventManager.highlighted = null;
            });
        };

        $scope.onClickFastForward = function onClickFastForward() {
            videoPlayer.then(function(vp) {
                vp.videoElement[0].playbackRate = (vp.videoElement[0].playbackRate !== 1) ? 1 : 3.0;
            });
        };

        $scope.onClickJumpBackward = function onClickJumpBackward() {
            videoPlayer.then(function(vp) {
                vp.seekTime($scope.currentClipTime - 1);
                vp.videoElement[0].playbackRate = 1;

                //reset highlighting since jumping backwards
                eventManager.highlighted = null;
            });
        };

        $scope.onClickJumpForward = function onClickJumpForward() {
            videoPlayer.then(function(vp) {
                vp.videoElement[0].playbackRate = (vp.videoElement[0].playbackRate !== 1) ? 1 : 0.25;
            });
        };
    }
]);

Videoplayer.directive('krossoverPlayPauseButton', [
    'config', 'VG_EVENTS', 'VG_STATES',
    function(config, VG_EVENTS, VG_STATES) {

        return {

            restrict: TO += ELEMENTS,
            require: '^videogular',
            scope: false,
            templateUrl: 'krossover-play-pause-button.html',

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
                }

                element.bind('click', onClickPlayPause);

                API.$on(VG_EVENTS.ON_SET_STATE, onChangeState);
            }
        };
    }
]);

Videoplayer.directive('krossoverMuteButton', [
    'config', 'package', 'VG_EVENTS',
    function(config, package, VG_EVENTS) {

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
