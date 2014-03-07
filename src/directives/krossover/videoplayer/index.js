/* Constants */
var TO = '';
var ELEMENTS = 'E';
var ATTRIBUTES = 'A';

/* Video play rate limit. */
var VIDEO_PLAYRATE_SPEEDLIMIT = 2;

/* Step rate when changing play rate. */
var VIDEO_PLAYRATE_STEP = 0.1;  // Use 10% speed steps

var IntelligenceWebClient = require('../../../app');


IntelligenceWebClient.directive('krossoverPlayPauseButton', [
    'VG_EVENTS', 'VG_STATES',
    function(VG_EVENTS, VG_STATES) {

        return {

            restrict: TO += ELEMENTS,
            require: '^videogular',
            scope: false,
            templateUrl: 'krossover-play-pause-button.html',

            controller: function($scope){

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

                    var VIDEO_PLAYRATE_REVERSE_SPEEDLIMIT = -1 * VIDEO_PLAYRATE_SPEEDLIMIT;

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

IntelligenceWebClient.directive('krossoverSlowBackwardButton', [
    function() {

        return {

            restrict: TO += ELEMENTS,
            require: '^videogular',
            templateUrl: 'krossover-slow-backward-button.html',

            link: function($scope, element, attributes, API) {

                function onClickSlowBackward(event) {

                    var video = API.videoElement[0];

                    /* If video is already stepping backwards. */
                    if (video.playbackRate === -VIDEO_PLAYRATE_STEP) {

                        /* Set the play rate to play normal. */
                        video.playbackRate = 1;
                        API.pause();

                    } else {

                        /* Set the play rate to play backwards very slowly. */
                        video.playbackRate = -VIDEO_PLAYRATE_STEP;
                        API.play();
                    }
                }

                element.bind('click', onClickSlowBackward);
            }
        };
    }
]);

IntelligenceWebClient.directive('krossoverSlowForwardButton', [
    function() {

        return {

            restrict: TO += ELEMENTS,
            require: '^videogular',
            templateUrl: 'krossover-slow-forward-button.html',

            link: function($scope, element, attributes, API) {

                function onClickSlowForward(event) {

                    var video = API.videoElement[0];

                    /* If video is already stepping backwards. */
                    if (video.playbackRate === VIDEO_PLAYRATE_STEP) {

                        /* Set the play rate to play normal. */
                        video.playbackRate = 1;
                        API.pause();

                    } else {

                        /* Set the play rate to play forwards very slowly. */
                        video.playbackRate = VIDEO_PLAYRATE_STEP;
                        API.play();
                    }
                }

                element.bind('click', onClickSlowForward);
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

            controller: function ($scope){

                /* NOTE: Uses FontAwesome icon classes. */
                $scope.muteIcon = 'icon-volume-off';
                $scope.volumeLevel0Icon = 'icon-volume-down';
                $scope.volumeLevel1Icon = 'icon-volume-down';
                $scope.volumeLevel2Icon = 'icon-volume-down';
                $scope.volumeLevel3Icon = 'icon-volume-up';
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
    function(VG_EVENTS){

        return {

            restrict: TO += ELEMENTS + ATTRIBUTES,
            require: '^videogular',
            templateUrl: 'krossover-full-screen-button.html',

            link: function($scope, element, attribute, API) {

                function onEnterFullScreen() {

                    $scope.fullscreen = true;
                }

                function onExitFullScreen() {

                    $scope.fullscreen = false;
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
