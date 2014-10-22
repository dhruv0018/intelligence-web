/**
 * @license Videogular v0.4.0 http://videogular.com
 * Two Fucking Developers http://twofuckingdevelopers.com
 * License: MIT
 */

var controls = angular.module('com.2fdevs.videogular.plugins.controls', []);

controls.directive('vgControls', [
    '$timeout', 'VG_STATES', 'VG_EVENTS',
    function($timeout, VG_STATES, VG_EVENTS) {
        return {
            restrict: 'E',
            require: '^videogular',
            transclude: true,
            template: '<div id="controls-container" ng-show="isReady" ng-class="animationClass" ng-transclude></div>',
            scope: {
                autoHide: '=vgAutohide',
                autoHideTime: '=vgAutohideTime'
            },
            link: function(scope, elem, attr, API) {
                var w = 0;
                var h = 0;
                var autoHideTime = 2000;
                var controlBarHeight = elem[0].style.height;
                var hideInterval;
                var isReadyInterval;

                scope.isReady = false;

                function onMouseMove() {
                    showControls();
                    scope.$apply();
                }

                function hideControls() {
                    scope.animationClass = 'hide-animation';
                }

                function showControls() {
                    scope.animationClass = 'show-animation';
                    $timeout.cancel(hideInterval);
                    if (scope.autoHide) hideInterval = $timeout(hideControls, autoHideTime);
                }

                function onPlayerReady() {
                    var size = API.getSize();

                    elem.css('bottom', '0px');
                    isReadyInterval = $timeout(showWhenIsReady, 500);
                }

                function showWhenIsReady() {
                    $timeout.cancel(isReadyInterval);
                    scope.isReady = true;
                }

                // If vg-autohide has been set
                if (scope.autoHide !== undefined) {
                    scope.$watch('autoHide', function(value) {
                        if (value) {
                            scope.animationClass = 'hide-animation';
                            API.videogularElement.bind('mousemove', onMouseMove);
                        }
                        else {
                            scope.animationClass = '';
                            $timeout.cancel(hideInterval);
                            API.videogularElement.unbind('mousemove', onMouseMove);
                            showControls();
                        }
                    });
                }

                // If vg-autohide-time has been set
                if (scope.autoHideTime !== undefined) {
                    scope.$watch('autoHideTime', function(value) {
                        autoHideTime = value;
                    });
                }

                if (API.isPlayerReady()) onPlayerReady();
                else API.$on(VG_EVENTS.ON_PLAYER_READY, onPlayerReady);
            }
        };
    }
]);

controls.directive('vgPlayPauseButton', [
    'VG_STATES', 'VG_EVENTS',
    function(VG_STATES, VG_EVENTS) {
        return {
            restrict: 'E',
            require: '^videogular',
            template: '<div class="iconButton" ng-class="playPauseIcon"></div>',
            link: function(scope, elem, attr, API) {
                function onChangeState(target, params) {
                    switch (params[0]) {
                        case VG_STATES.PLAY:
                            scope.playPauseIcon = {pause: true};
                            break;

                        case VG_STATES.PAUSE:
                            scope.playPauseIcon = {play: true};
                            break;

                        case VG_STATES.STOP:
                            scope.playPauseIcon = {play: true};
                            break;
                    }
                }

                function onClickPlayPause() {
                    API.playPause();
                    scope.$apply();
                }

                scope.playPauseIcon = {play: true};

                elem.bind('click', onClickPlayPause);
                API.$on(VG_EVENTS.ON_SET_STATE, onChangeState);
            }
        };
    }
]);

controls.directive('vgScrubbar', [
    'VG_EVENTS', 'VG_STATES', 'VG_UTILS', 'EventManager',
    function(VG_EVENTS, VG_STATES, VG_UTILS, eventManager) {
        return {
            restrict: 'AE',
            require: '^videogular',
            replace: true,
            scope: false,
            transclude: false,
            link: function(scope, elem, attr, API) {

                var isSeeking = false;
                var isPlaying = false;
                var isPlayingWhenSeeking = false;

                var currentTimeMarker = elem.find('data-vg-scrubbarcurrenttime');

                function onScrubBarMouseDown(event) {
                    event = VG_UTILS.fixEventOffset(event);

                    isSeeking = true;
                    if (isPlaying) isPlayingWhenSeeking = true;
                    API.pause();
                    seekTime(event.offsetX);
                }
                function onScrubBarMouseUp(event) {
                    event = VG_UTILS.fixEventOffset(event);

                    if (isPlayingWhenSeeking) {
                        isPlayingWhenSeeking = false;
                        API.play();
                    }

                    if (isSeeking) {
                        var position = elem[0].getBoundingClientRect();
                        var eventOffsetX = event.clientX - position.left;
                        seekTime(eventOffsetX, true);
                    }

                    isSeeking = false;
                }
                function onScrubBarMouseMove(event) {
                    if (isSeeking) {
                        event = VG_UTILS.fixEventOffset(event);
                        var position = elem[0].getBoundingClientRect();
                        var eventOffsetX = event.clientX - position.left;
                        eventOffsetX = (eventOffsetX > 0) ? eventOffsetX : 0;
                        eventOffsetX = (eventOffsetX > position.width) ? position.width : eventOffsetX;
                        seekTime(eventOffsetX);
                    }
                }
                function onScrubBarMouseLeave(event) {
                }
                function seekTime(offsetX, applyToVideo) {

                    var playStartTime = scope.playStartTime || 0;
                    var clipEndTime = scope.clipEndTime || 0;

                    var seekTimeVal = offsetX / elem[0].scrollWidth * (clipEndTime - playStartTime);
                    var newVideoTime = seekTimeVal + playStartTime;

                    currentTimeMarker.css('width', (offsetX / elem[0].scrollWidth * 100) + '%');
                    eventManager.reset();

                    API.setTimeDisplay(seekTimeVal);

                    if (applyToVideo) API.seekTime(newVideoTime);
                }

                function onChangeState(target, params) {
                    if (!isSeeking) {
                        switch (params[0]) {
                            case VG_STATES.PLAY:
                                isPlaying = true;
                                break;

                            case VG_STATES.PAUSE:
                                isPlaying = false;
                                break;

                            case VG_STATES.STOP:
                                isPlaying = false;
                                break;
                        }
                    }
                }

                API.$on(VG_EVENTS.ON_SET_STATE, onChangeState);

                elem.bind('mousedown', onScrubBarMouseDown);
                angular.element(document).bind('mouseup', onScrubBarMouseUp);
                angular.element(document).bind('mousemove', onScrubBarMouseMove);
                elem.bind('mouseleave', onScrubBarMouseLeave);
            }
        };
    }
]);

controls.directive('vgScrubbarcurrenttime', [
    'VG_EVENTS',
    function(VG_EVENTS) {
        return {
            restrict: 'E',
            require: '^videogular',
            scope: false,
            transclude: false,
            link: function(scope, elem, attr, API) {
                var percentTime = 0;

                function onUpdateTime(target, timeParams) {
                    var playStartTime = scope.playStartTime || 0;
                    var clipEndTime = scope.clipEndTime || 0;

                    percentTime = Math.round(((timeParams[0] - playStartTime) / (clipEndTime - playStartTime)) * 100);
                    elem.css('width', percentTime + '%');
                }

                function onComplete(target, params) {
                    percentTime = 0;
                    elem.css('width', percentTime + '%');
                }

                API.$on(VG_EVENTS.ON_UPDATE_TIME, onUpdateTime);
                API.$on(VG_EVENTS.ON_COMPLETE, onComplete);
            }
        };
    }
]);

controls.directive('vgVolume', [
    'VG_UTILS',
    function(VG_UTILS) {
        return {
            restrict: 'E',
            link: function(scope, elem, attr) {
                function onMouseOverVolume() {
                    scope.volumeVisibility = 'visible';
                    scope.$apply();
                }

                function onMouseLeaveVolume() {
                    scope.volumeVisibility = 'hidden';
                    scope.$apply();
                }

                // We hide volume controls on mobile devices
                if (VG_UTILS.isMobileDevice()) {
                    elem.css('display', 'none');
                }
                else {
                    scope.volumeVisibility = 'hidden';

                    elem.bind('mouseover', onMouseOverVolume);
                    elem.bind('mouseleave', onMouseLeaveVolume);
                }
            }
        };
    }
]);

controls.directive('vgVolumebar', [
    'VG_EVENTS', 'VG_UTILS',
    function(VG_EVENTS, VG_UTILS) {
        return {
            restrict: 'E',
            require: '^videogular',
            template:
                '<div class="verticalVolumeBar">' +
                    '<div class="volumeBackground">' +
                        '<div class="volumeValue"></div>' +
                        '<div class="volumeClickArea"></div>' +
                    '</div>' +
                '</div>',
            link: function(scope, elem, attr, API) {
                var isChangingVolume = false;
                var volumeBackElem = angular.element(elem[0].getElementsByClassName('volumeBackground'));
                var volumeValueElem = angular.element(elem[0].getElementsByClassName('volumeValue'));

                function onClickVolume(event) {
                    event = VG_UTILS.fixEventOffset(event);
                    var volumeHeight = parseInt(volumeBackElem.prop('offsetHeight'));
                    var value = event.offsetY * 100 / volumeHeight;
                    var volValue = 1 - (value / 100);
                    updateVolumeView(value);

                    API.setVolume(volValue);

                    scope.$apply();
                }

                function onMouseDownVolume(event) {
                    isChangingVolume = true;
                }

                function onMouseUpVolume(event) {
                    isChangingVolume = false;
                }

                function onMouseLeaveVolume(event) {
                    isChangingVolume = false;
                }

                function onMouseMoveVolume(event) {
                    if (isChangingVolume) {
                        event = VG_UTILS.fixEventOffset(event);
                        var volumeHeight = parseInt(volumeBackElem.prop('offsetHeight'));
                        var value = event.offsetY * 100 / volumeHeight;
                        var volValue = 1 - (value / 100);
                        updateVolumeView(value);

                        API.setVolume(volValue);

                        scope.$apply();
                    }
                }

                function updateVolumeView(value) {
                    volumeValueElem.css('height', value + '%');
                    volumeValueElem.css('top', (100 - value) + '%');
                }

                function onSetVolume(target, params) {
                    updateVolumeView(params[0] * 100);
                }

                function onChangeVisibility(value) {
                    elem.css('visibility', value);
                }

                elem.css('visibility', scope.volumeVisibility);

                scope.$watch('volumeVisibility', onChangeVisibility);

                volumeBackElem.bind('click', onClickVolume);
                volumeBackElem.bind('mousedown', onMouseDownVolume);
                volumeBackElem.bind('mouseup', onMouseUpVolume);
                volumeBackElem.bind('mousemove', onMouseMoveVolume);
                volumeBackElem.bind('mouseleave', onMouseLeaveVolume);

                API.$on(VG_EVENTS.ON_SET_VOLUME, onSetVolume);
            }
        };
    }
]);

controls.directive('vgMutebutton', [
    'VG_EVENTS',
    function(VG_EVENTS) {
        return {
            restrict: 'E',
            require: '^videogular',
            template: '<div class="iconButton" ng-class="muteIcon"></div>',
            link: function(scope, elem, attr, API) {
                var isMuted = false;

                function onClickMute(event) {
                    if (isMuted) {
                        scope.currentVolume = scope.defaultVolume;
                    }
                    else {
                        scope.currentVolume = 0;
                        scope.muteIcon = {mute: true};
                    }

                    isMuted = !isMuted;

                    API.setVolume(scope.currentVolume);

                    scope.$apply();
                }

                function onSetVolume(target, params) {
                    scope.currentVolume = params[0];

                    // TODO: Save volume with LocalStorage
                    // if it's not muted we save the default volume
                    if (!isMuted) {
                        scope.defaultVolume = params[0];
                    }
                    else {
                        // if was muted but the user changed the volume
                        if (params[0] > 0) {
                            scope.defaultVolume = params[0];
                        }
                    }

                    var percentValue = Math.round(params[0] * 100);
                    if (percentValue === 0) {
                        scope.muteIcon = {mute: true};
                    }
                    else if (percentValue > 0 && percentValue < 25) {
                        scope.muteIcon = {level0: true};
                    }
                    else if (percentValue >= 25 && percentValue < 50) {
                        scope.muteIcon = {level1: true};
                    }
                    else if (percentValue >= 50 && percentValue < 75) {
                        scope.muteIcon = {level2: true};
                    }
                    else if (percentValue >= 75) {
                        scope.muteIcon = {level3: true};
                    }

                    //scope.$apply();
                }

                scope.defaultVolume = 1;
                scope.currentVolume = scope.defaultVolume;
                scope.muteIcon = {level3: true};

                //TODO: get volume from localStorage
                elem.bind('click', onClickMute);

                API.$on(VG_EVENTS.ON_SET_VOLUME, onSetVolume);
            }
        };
    }
]);

controls.directive('vgFullscreenbutton', [
    '$window', 'VG_EVENTS',
    function($window, VG_EVENTS) {
        return {
            restrict: 'AE',
            require: '^videogular',
            scope: {
                vgEnterFullScreenIcon: '=',
                vgExitFullScreenIcon: '='
            },
            template: '<div class="iconButton" ng-class="fullscreenIcon"></div>',
            link: function(scope, elem, attr, API) {
                function onEnterFullScreen() {
                    scope.fullscreenIcon = {exit: true};
                }
                function onExitFullScreen() {
                    scope.fullscreenIcon = {enter: true};
                }
                function onClickFullScreen(event) {
                    API.toggleFullScreen();

                    scope.$apply();
                }

                elem.bind('click', onClickFullScreen);
                scope.fullscreenIcon = {enter: true};

                API.$on(VG_EVENTS.ON_ENTER_FULLSCREEN, onEnterFullScreen);
                API.$on(VG_EVENTS.ON_EXIT_FULLSCREEN, onExitFullScreen);
            }
        };
    }
]);
