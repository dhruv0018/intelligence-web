/* Constants */
var TO = '';
var ELEMENTS = 'E';
var ATTRIBUTES = 'A';

/* Step rate when changing play rate. */
var VIDEO_PLAYRATE_STEP = 0.1;  // Use 10% speed steps

var package = require('../../../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

IntelligenceWebClient.directive('krossoverPlayPauseButton', [
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

                    /* Set the play rate to play normal. */
                    API.videoElement[0].playbackRate = 1;

                    API.playPause();
                }

                element.bind('click', onClickPlayPause);

                API.$on(VG_EVENTS.ON_SET_STATE, onChangeState);
            }
        };
    }
]);

IntelligenceWebClient.directive('krossoverFastBackwardButton', [
    function() {

        return {

            restrict: TO += ELEMENTS,
            require: '^videogular',
            templateUrl: 'krossover-fast-backward-button.html',

            link: function($scope, element, attributes, API) {

                function onClickFastBackward(event) {

                    /* NOTE: Negative values for playback rate mean backwards. */

                    var VIDEO_PLAYRATE_REVERSE_SPEEDLIMIT = -1 * config.indexing.video.speedlimit;

                    var video = API.videoElement[0];

                    /* If video is going forward.*/
                    if (Math.floor(video.playbackRate) > 0) {

                        /* Decrease the play rate by the step rate. */
                        video.playbackRate = Math.abs(video.playbackRate) * (1 - VIDEO_PLAYRATE_STEP);

                    } else {

                        /* Reverse the play rate by the step rate. */
                        video.playbackRate = -1 * Math.abs(video.playbackRate) * (1 + VIDEO_PLAYRATE_STEP);
                    }

                    /* Ensure the play rate is greater than the minimum rate. */
                    if (video.playbackRate < VIDEO_PLAYRATE_REVERSE_SPEEDLIMIT) {

                        video.playbackRate = VIDEO_PLAYRATE_REVERSE_SPEEDLIMIT;
                    }

                    API.play();
                }

                element.bind('click', onClickFastBackward);
            }
        };
    }
]);

IntelligenceWebClient.directive('krossoverFastForwardButton', [
    function() {

        return {

            restrict: TO += ELEMENTS,
            require: '^videogular',
            templateUrl: 'krossover-fast-forward-button.html',

            link: function($scope, element, attributes, API) {

                function onClickFastForward(event) {

                    var VIDEO_PLAYRATE_SPEEDLIMIT = config.indexing.video.speedlimit;

                    var video = API.videoElement[0];

                    /* If video is going backwards.*/
                    if (Math.floor(video.playbackRate) < -1) {

                        /* Increase the play rate by the step rate. */
                        video.playbackRate = -1 * Math.abs(video.playbackRate) * (1 - VIDEO_PLAYRATE_STEP);

                    } else {

                        /* Reverse the play rate by the step rate. */
                        video.playbackRate = Math.abs(video.playbackRate) * (1 + VIDEO_PLAYRATE_STEP);
                    }

                    /* Ensure the play rate is less than the maximum rate. */
                    if (video.playbackRate > VIDEO_PLAYRATE_SPEEDLIMIT) {

                        video.playbackRate = VIDEO_PLAYRATE_SPEEDLIMIT;
                    }

                    API.play();
                }

                element.bind('click', onClickFastForward);
            }
        };
    }
]);

IntelligenceWebClient.directive('krossoverJumpBackwardButton', [
    function() {

        return {

            restrict: TO += ELEMENTS,
            require: '^videogular',
            templateUrl: 'krossover-jump-backward-button.html',

            link: function($scope, element, attributes, API) {

                function onClickJumpBackward(event) {

                    var video = API.videoElement[0];
                    var currentTime = video.currentTime;
                    var time = currentTime - config.indexing.video.jump;

                    API.seekTime(time);
                }

                element.bind('click', onClickJumpBackward);
            }
        };
    }
]);

IntelligenceWebClient.directive('krossoverJumpForwardButton', [
    function() {

        return {

            restrict: TO += ELEMENTS,
            require: '^videogular',
            templateUrl: 'krossover-jump-forward-button.html',

            link: function($scope, element, attributes, API) {

                function onClickJumpForward(event) {

                    var video = API.videoElement[0];
                    var currentTime = video.currentTime;
                    var time = currentTime + config.indexing.video.jump;

                    API.seekTime(time);
                }

                element.bind('click', onClickJumpForward);
            }
        };
    }
]);

IntelligenceWebClient.directive('krossoverMuteButton', [
    'VG_EVENTS',
    function(VG_EVENTS) {

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

IntelligenceWebClient.directive('krossoverFullscreenButton', [
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
                    $scope.$apply();
                }

                function onClickFullScreen(event) {

                    API.toggleFullScreen();
                }

                element.bind('click', onClickFullScreen);

                API.$on(VG_EVENTS.ON_ENTER_FULLSCREEN, onEnterFullScreen);
                API.$on(VG_EVENTS.ON_EXIT_FULLSCREEN, onExitFullScreen);
            }
        };
    }
]);

