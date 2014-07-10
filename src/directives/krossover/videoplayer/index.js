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
                    API.videoElement[0].playbackRate = 1.0;

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

                    API.videoElement[0].playbackRate = (API.videoElement[0].playbackRate > 1) ? 1 : -3.0;

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
                    API.videoElement[0].playbackRate = (API.videoElement[0].playbackRate < 1) ? 1 : 3.0;
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
                    API.videoElement[0].playbackRate = (API.videoElement[0].playbackRate > 0 && API.videoElement[0].playbackRate !== 1) ? 1 : -0.25;
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
                    API.videoElement[0].playbackRate = (API.videoElement[0].playbackRate < 0) ? 1 : 0.25;
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
    function(VG_EVENTS) {

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

