/**
 * @license Videogular v0.4.0 http://videogular.com
 * Two Fucking Developers http://twofuckingdevelopers.com
 * License: MIT
 */
var kAddEventListener = window.addEventListener;

var videogular = angular.module('com.2fdevs.videogular', ['ngSanitize']);

videogular.constant('VG_STATES', {
    PLAY: 'play',
    PAUSE: 'pause',
    STOP: 'stop'
});

videogular.factory('VideoElement', function() {

    var self = this;
    this.videoElement = document.createElement('video');
    this.videoElement.autoPlay = false;
    this.videoElement.id = 'krossoverVideoPlayer';

    self.get = function get() {
        return self.videoElement;
    };

    self.getWrapped = function getWrapped() {
        return angular.element(self.get());
    };

    self.clearSources = function clearSources() {
        self.getWrapped().attr('src', '');
        self.getWrapped().attr('type', '');
    };

    self.setSources = function setSources(sources) {

        self.clearSources();

        if (!sources || !sources.length) return;

        canPlay = '';

        // It's a cool browser
        if (self.get().canPlayType) {
            for (var i = 0, l = sources.length; i < l; i++) {
                canPlay = self.get().canPlayType(sources[i].type);

                if (canPlay == 'maybe' || canPlay == 'probably') {
                    self.getWrapped().attr('src', sources[i].src);
                    self.getWrapped().attr('type', sources[i].type);
                    break;
                }
            }
        }
        // It's a crappy browser and it doesn't deserve any respect
        else {
            // Get H264 or the first one
            self.getWrapped().attr('src', sources[0].src);
            self.getWrapped().attr('type', sources[0].type);
        }

    };

    return {
        clearSources: self.clearSources,
        setSources: self.setSources,
        get: self.get,
        getWrapped: self.getWrapped
    };

});

videogular.constant('VG_EVENTS', {
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

videogular.service('VG_UTILS',
    function() {
        this.fixEventOffset = function($event) {
            /**
             * There's no offsetX in Firefox, so we fix that.
             * Solution provided by Jack Moore in this post:
             * http://www.jacklmoore.com/notes/mouse-position/
             * @param $event
             * @returns {*}
             */
            if (navigator.userAgent.match(/Firefox/i) && $event && $event.currentTarget && typeof $event.currentTarget.getBoundingClientRect === 'function') {
                var style = $event.currentTarget.currentStyle || window.getComputedStyle($event.target, null);
                var borderLeftWidth = parseInt(style.borderLeftWidth, 10);
                var borderTopWidth = parseInt(style.borderTopWidth, 10);
                var rect = $event.currentTarget.getBoundingClientRect();
                var offsetX = $event.clientX - borderLeftWidth - rect.left;
                var offsetY = $event.clientY - borderTopWidth - rect.top;

                $event.offsetX = offsetX;
                $event.offsetY = offsetY;
            }

            return $event;
        };
        /**
         * Inspired by Paul Irish
         * https://gist.github.com/paulirish/211209
         * @returns {number}
         */
        this.getZIndex = function() {
            var zIndex = 1;

            angular.element('*')
                .filter(function() { return angular.element(this).css('zIndex') !== 'auto'; })
                .each(function() {
                    var thisZIndex = parseInt(angular.element(this).css('zIndex'));
                    if (zIndex < thisZIndex) zIndex = thisZIndex + 1;
                });

            return zIndex;
        };

        // Very simple mobile detection, not 100% reliable
        this.isMobileDevice = function() {
            return (typeof window.orientation !== 'undefined') || (navigator.userAgent.indexOf('IEMobile') !== -1);
        };

        this.isiOSDevice = function() {
            return (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i));
        };
    }
);

videogular.run(['$window', 'VG_UTILS',
    function($window, VG_UTILS) {
        // Native fullscreen polyfill
        var fullScreenAPI;
        var APIs = {
            w3: {
                enabled: 'fullscreenEnabled',
                element: 'fullscreenElement',
                request: 'requestFullscreen',
                exit:    'exitFullscreen',
                onchange: 'fullscreenchange',
                onerror:  'fullscreenerror'
            },
            newWebkit: {
                enabled: 'webkitFullscreenEnabled',
                element: 'webkitFullscreenElement',
                request: 'webkitRequestFullscreen',
                exit:    'webkitExitFullscreen',
                onchange: 'webkitfullscreenchange',
                onerror:  'webkitfullscreenerror'
            },
            oldWebkit: {
                enabled: 'webkitIsFullScreen',
                element: 'webkitCurrentFullScreenElement',
                request: 'webkitRequestFullScreen',
                exit:    'webkitCancelFullScreen',
                onchange: 'webkitfullscreenchange',
                onerror:  'webkitfullscreenerror'
            },
            moz: {
                enabled: 'mozFullScreen',
                element: 'mozFullScreenElement',
                request: 'mozRequestFullScreen',
                exit:    'mozCancelFullScreen',
                onchange: 'mozfullscreenchange',
                onerror:  'mozfullscreenerror'
            },
            ios: {
                enabled: 'webkitFullscreenEnabled',
                element: 'webkitFullscreenElement',
                request: 'webkitEnterFullscreen',
                exit: undefined,
                onexit: 'webkitendfullscreen',
                onchange: 'webkitfullscreenchange',
                onerror:  'webkitfullscreenerror'
            },
            ms: {
                enabled: 'msFullscreenEnabled',
                element: 'msFullscreenElement',
                request: 'msRequestFullscreen',
                exit:    'msExitFullscreen',
                onchange: 'msfullscreenchange',
                onerror:  'msfullscreenerror'
            }
        };

        var isFullScreenFunc = function() {
            return (document[this.element] !== null);
        };

        for (var browser in APIs) {
            if (APIs[browser].enabled in document) {
                fullScreenAPI = APIs[browser];
                fullScreenAPI.isFullScreen = isFullScreenFunc;
                break;
            }
        }

        // Override APIs on iOS
        if (VG_UTILS.isiOSDevice()) {
            fullScreenAPI = APIs.ios;
            fullScreenAPI.isFullScreen = function() {
                return (document[this.element] !== null);
            };
        }

        angular.element($window)[0].fullScreenAPI = fullScreenAPI;
    }
]);

    /**
     * @ngdoc directive
     * @name com.2fdevs.videogular.videogular:videogular
     * @restrict E
     * @description
     * Main directive that must wrap a &lt;video&gt; tag and all plugins.
     *
     * &lt;video&gt; tag usually will be above plugin tags, that's because plugins should be in a layer over the &lt;video&gt;.
     *
     * You can customize `videogular` with these attributes:
     *
     * @param {number or string} vgWidth This directive sets width for the entire player. Passing a number will set the width normally. Passing a string will create a binding with a scope variable in case it exists.
     *
     * If `vgWidth` or `vgHeight` are not declared, or `vgResponsive` is `'true'`, player will enter in a responsive mode and width will be 100% and height will be calculated through video metadata to preserve aspect ratio.
     *
     * @param {number or string} vgHeight This directive sets height for the entire player. Passing a number will set the height normally. Passing a string will create a binding with a scope variable in case it exists.
     *
     * If `vgWidth` or `vgHeight` are not declared, or `vgResponsive` is `'true'`, player will enter in a responsive mode and width will be 100% and height will be calculated through video metadata to preserve aspect ratio.
     *
     * @param {string} vgTheme String with a scope name variable. This directive will inject a CSS link in the header of your page.
     * **This parameter is required.**
     *
     * @param {boolean or string} [autoPlay=false] vgAutoplay Boolean value or a String with a scope name variable to auto start playing video when it is initialized.
     *
     * **This parameter is disabled in mobile devices** because user must click on content to prevent consuming mobile data plans.
     *
     * @param {string} [stretch=none] vgStretch String value representing a stretch mode. This value controls how image will scale inside its container. Stretch modes available are 'none', 'fit' or 'fill'.
     *
     * - **'none'**: Will set the image in its original size.
     * - **'fit'**: Will try to show always all the image leaving black bars above and below.
     * - **'fill'**: Will try to cover all video player area to never show black bars above and below.
     *
     * Content will always appear centered.
     *
     * @param {boolean or string} [isResponsive=false] vgResponsive Boolean value or a String with a scope name variable to auto start playing video when it is initialized.
     *
     * @param {function} vgComplete Function name in controller's scope to call when video have been completed.
     * @param {function} vgUpdateVolume Function name in controller's scope to call when volume changes. Receives a param with the new volume.
     * @param {function} vgUpdateTime Function name in controller's scope to call when video playback time is updated. Receives two params with current time and duration in milliseconds.
     * @param {function} vgUpdateSize Function name in controller's scope to call when videogular size is updated. Receives two param with the new width and height.
     * @param {function} vgUpdateState Function name in controller's scope to call when video state changes. Receives a param with the new state. Possible values are 'play', 'stop' or 'pause'.
     * @param {function} vgPlayerReady Function name in controller's scope to call when video have been initialized. Receives a param with the videogular API.
     * @param {function} vgChangeSource Function name in controller's scope to change current video source. Receives a param with the new video.
     * This is a free parameter and it could be values like 'new.mp4', '320' or 'sd'. This will allow you to use this to change a video or video quality.
     * This callback will not change the video, you should do that by updating your sources scope variable.
     *
     */
videogular.directive('videogular', [
    '$window', 'VG_STATES', 'VG_EVENTS', 'VG_UTILS', 'VideoElement',
    function($window, VG_STATES, VG_EVENTS, VG_UTILS, videoElementService) {

        var eventListeners = Object.create(null);
        var addEventListener = function(obj, name, handleFunc, useCapture) {
            eventListeners[name] = eventListeners[name] || [];
            var listener = {
                obj: obj,
                handler: handleFunc
            };
            eventListeners[name].push(listener);
            obj.addEventListener(name, handleFunc, useCapture);
        };

        var removeEventListeners = function() {
            for (var eventListenerName in eventListeners) {
                for (var j = 0; j < eventListeners[eventListenerName].length; j++) {
                    var listenerObj = eventListeners[eventListenerName][j];
                    listenerObj.obj.removeEventListener(eventListenerName, listenerObj.handler);
                }
            }
        };

        return {
            restrict: 'E',
            scope: {
                autoPlay: '=vgAutoplay',
                vgComplete: '&',
                vgUpdateVolume: '&',
                vgUpdateTime: '&',
                vgUpdateSize: '&',
                vgUpdateState: '&',
                vgPlayerReady: '&',
                vgChangeSource: '&',
                vgVideoTitle: '=?',
                sources: '=vgSources'
            },
            controller: ['$scope', '$filter', function($scope, $filter) {
                var currentWidth = null;
                var currentHeight = null;

                var currentStretch = $scope.stretch;
                var playerWidth = 0;
                var playerHeight = 0;
                var isFullScreenPressed = false;
                $scope.isFullScreen = false;
                var isMetaDataLoaded = false;
                var isElementReady = false;
                var isVideoReady = false;
                var isPlayerReady = false;
                var isResponsive = false;
                var self = this;

                var skipTimeUpdateCallBack = false;

                var vgCompleteCallBack = $scope.vgComplete();
                var vgUpdateVolumeCallBack = $scope.vgUpdateVolume();
                var vgUpdateTimeCallBack = $scope.vgUpdateTime();
                var vgUpdateSizeCallBack = $scope.vgUpdateSize();
                var vgUpdateStateCallBack = $scope.vgUpdateState();
                var vgPlayerReadyCallBack = $scope.vgPlayerReady();
                var vgChangeSourceCallBack = $scope.vgChangeSource();

                $scope.currentState = VG_STATES.STOP;
                $scope.playerWidth = $scope.playerHeight = 0;

                // PUBLIC $API
                this.$on = function() {
                    $scope.$on.apply($scope, arguments);
                };

                this.isPlayerReady = function() {
                    return isPlayerReady;
                };

                this.seekTime = function(value, offset, byPercent) {
                    var second = value;

                    //To make seeking work for events in a play
                    if ($scope.vgVideoTitle === 'reelsPlayer' && !isNaN(offset)) {
                        second = value - offset;
                    }

                    if (byPercent) {
                        second = value * this.videoElement[0].duration / 100;
                        this.videoElement[0].currentTime = second;
                    }
                    else {
                        this.videoElement[0].currentTime = second;
                    }

                    $scope.$emit(VG_EVENTS.ON_SEEK_TIME, [second]);
                };

                this.playPause = function() {
                    if (this.videoElement[0].paused) {
                        this.play();
                    }
                    else {
                        this.pause();
                    }
                };

                this.setSources = function(sourcesArray) {
                    this.videoElementService.setSources(sourcesArray);
                };

                this.clearSources = function() {
                    if (this.videoElementService && typeof this.videoElementService.clearSources === 'function') this.videoElementService.clearSources();
                };

                this.setState = function(newState) {
                    if (newState && newState != $scope.currentState) {
                        if ($scope.vgUpdateState()) {
                            vgUpdateStateCallBack = $scope.vgUpdateState();
                            vgUpdateStateCallBack(newState);
                        }

                        $scope.currentState = newState;
                        $scope.$emit(VG_EVENTS.ON_SET_STATE, [$scope.currentState]);
                    }

                    return $scope.currentState;
                };

                this.play = function() {
                    this.videoElement[0].play();
                    this.setState(VG_STATES.PLAY);
                    $scope.$emit(VG_EVENTS.ON_PLAY);
                };

                this.pause = function() {
                    this.videoElement[0].pause();
                    this.setState(VG_STATES.PAUSE);
                    $scope.$emit(VG_EVENTS.ON_PAUSE);
                };

                this.stop = function() {
                    this.videoElement[0].pause();
                    this.videoElement[0].currentTime = 0;
                    this.setState(VG_STATES.STOP);
                    $scope.$emit(VG_EVENTS.ON_COMPLETE);
                };

                this.toggleFullScreen = function() {
                    // There is no native full screen support
                    if (!angular.element($window)[0].fullScreenAPI) {
                        if ($scope.isFullScreen) {
                            this.videogularElement.css('z-index', 0);
                        }
                        else {
                            this.videogularElement.css('z-index', VG_UTILS.getZIndex());
                        }
                    }
                    // Perform native full screen support
                    else {
                        if (angular.element($window)[0].fullScreenAPI.isFullScreen()) {
                            if (!VG_UTILS.isMobileDevice()) {
                                document[angular.element($window)[0].fullScreenAPI.exit]();
                            }
                        }
                        else {
                            // On mobile devices we should make fullscreen only the video object
                            if (VG_UTILS.isMobileDevice()) {
                                // On iOS we should check if user pressed before fullscreen button
                                // and also if metadata is loaded
                                if (VG_UTILS.isiOSDevice()) {
                                    if (isMetaDataLoaded) {
                                        this.enterElementInFullScreen(this.videoElement[0]);
                                    }
                                    else {
                                        isFullScreenPressed = true;
                                        this.play();
                                    }
                                }
                                else {
                                    this.enterElementInFullScreen(this.videoElement[0]);
                                }
                            }
                            else {
                                this.enterElementInFullScreen(this.elementScope[0]);
                            }
                        }
                    }

                    $scope.isFullScreen = !$scope.isFullScreen;
                    $scope.fitVideo();
                };

                this.enterElementInFullScreen = function(element) {
                    element[angular.element($window)[0].fullScreenAPI.request]();
                };

                this.changeSource = function(newValue) {
                    if ($scope.vgChangeSource()) {
                        vgChangeSourceCallBack = $scope.vgChangeSource();
                        vgChangeSourceCallBack(newValue);
                    }
                };

                this.setVolume = function(newVolume) {
                    if ($scope.vgUpdateVolume()) {
                        vgUpdateVolumeCallBack = $scope.vgUpdateVolume();
                        vgUpdateVolumeCallBack(newVolume);
                    }

                    this.videoElement[0].volume = newVolume;
                    $scope.$emit(VG_EVENTS.ON_SET_VOLUME, [newVolume]);
                };

                this.updateStretch = function(value) {
                    currentStretch = value;
                    $scope.updateSize();
                };

                this.setSize = function(newWidth, newHeight) {
                    currentWidth = newWidth;
                    currentHeight = newHeight;

                    $scope.updateSize();
                };

                this.getSize = function() {
                    return {width: currentWidth, height: currentHeight};
                };

                this.setTimeDisplay = function setTimeDisplay(timeInSeconds) {
                    //Need this because the .time-current element might not be loaded yet
                    self.currentTimeElement = self.currentTimeElement.length ? self.currentTimeElement : angular.element(self.videogularElement[0].getElementsByClassName('time-current'));

                    /*
                     *  REQUIRES STYLE:
                     *    .time-current:after {
                     *      content: attr(data-current-time-value);
                     *    }
                     */
                    if (self.currentTimeElement.length) self.currentTimeElement.attr('data-current-time-value', $filter('secondsToTime')(timeInSeconds));
                };

                // PRIVATE FUNCTIONS
                $scope.API = this;

                $scope.init = function() {
                    $scope.addBindings();

                    if (angular.element($window)[0].fullScreenAPI) {
                        addEventListener(document, angular.element($window)[0].fullScreenAPI.onchange, $scope.onFullScreenChange);
                    }
                };

                $scope.addBindings = function() {

                    $scope.$watch('autoPlay', function(newValue, oldValue) {
                        if (newValue != oldValue) {
                            self.play();
                        }
                    });

                };

                $scope.onElementReady = function() {
                    isElementReady = true;

                    if (isVideoReady) {
                        $scope.onPlayerReady();
                    }
                };

                $scope.onVideoReady = function() {
                    isVideoReady = true;

                    if (isElementReady) {
                        $scope.onPlayerReady();
                    }
                };

                $scope.onPlayerReady = function() {
                    addEventListener(self.videoElement[0], 'loadedmetadata', $scope.onLoadedMetaData);

                    $scope.doPlayerReady();
                };

                $scope.onLoadedMetaData = function() {
                    isMetaDataLoaded = true;
                    $scope.doPlayerReady();
                };

                $scope.doPlayerReady = function() {
                    if (isResponsive) {
                        var percentWidth = self.elementScope[0].parentNode.clientWidth * 100 / self.videoElement[0].videoWidth;
                        var videoHeight = self.videoElement[0].videoHeight * percentWidth / 100;
                        currentWidth = self.elementScope[0].parentNode.clientWidth;
                        currentHeight = videoHeight;
                    }

                    isPlayerReady = true;
                    $scope.fitVideo();

                    if ($scope.vgPlayerReady()) {
                        vgPlayerReadyCallBack = $scope.vgPlayerReady();
                        vgPlayerReadyCallBack(self);
                    }
                    $scope.$emit(VG_EVENTS.ON_PLAYER_READY);

                    if ($scope.autoPlay && !VG_UTILS.isMobileDevice() || $scope.currentState === VG_STATES.PLAY) self.play();
                };

                $scope.onFullScreenChange = function(event) {
                    if (angular.element($window)[0].fullScreenAPI.isFullScreen()) {
                        $scope.$emit(VG_EVENTS.ON_ENTER_FULLSCREEN);
                    }
                    else {
                        $scope.$emit(VG_EVENTS.ON_EXIT_FULLSCREEN);
                    }

                    $scope.fitVideo();
                };

                $scope.onComplete = function(event) {
                    if ($scope.vgComplete()) {
                        vgCompleteCallBack = $scope.vgComplete();
                        vgCompleteCallBack();
                    }

                    self.setState(VG_STATES.STOP);
                    $scope.$emit(VG_EVENTS.ON_COMPLETE);
                };

                $scope.onStartBuffering = function(event) {
                    $scope.$emit(VG_EVENTS.ON_BUFFERING);
                };

                $scope.onStartPlaying = function(event) {
                    // Chrome fix: Chrome needs to update the video tag size or it will show a white screen
                    event.target.width++;
                    event.target.width--;

                    $scope.$emit(VG_EVENTS.ON_START_PLAYING, [event.target.duration]);
                };

                $scope.onUpdateTime = function(event) {

                    //video player element emits update time every 300ms skip every other
                    //emit to make the page the video player is on run smoother
                    if (skipTimeUpdateCallBack) {
                        skipTimeUpdateCallBack = false;
                        return;
                    }

                    skipTimeUpdateCallBack = true;

                    if ($scope.vgUpdateTime()) {
                        vgUpdateTimeCallBack = $scope.vgUpdateTime();
                        vgUpdateTimeCallBack(event.target.currentTime, event.target.duration);
                    }

                    $scope.$emit(VG_EVENTS.ON_UPDATE_TIME, [event.target.currentTime, event.target.duration]);
                };

                $scope.init();

                $scope.$on('$destroy', function() {
                    removeEventListeners();
                    self.currentTimeElement = [];
                });
            }],
            link: {
                pre: function(scope, elem, attr, controller) {

                    scope.controlsHeight = 60; //Not loaded at this point, so need to hardcode

                    scope.fitVideo = function fitVideo() {

                        if (angular.element($window)[0].fullScreenAPI && angular.element($window)[0].fullScreenAPI.isFullScreen()) {
                            elem.css('width', $window.innerWidth + 'px');
                            elem.css('height', ($window.innerHeight - scope.controlsHeight) + 'px');
                        } else {

                            var currentVideoWidth = elem.parent()[0].getBoundingClientRect().width;
                            var parentHeight = elem.parent()[0].getBoundingClientRect().height;

                            if ((currentVideoWidth / (parentHeight - scope.controlsHeight)) > (16 / 9)) {
                                currentVideoWidth = (parentHeight - scope.controlsHeight) * 16 / 9;
                                currentVideoWidth *= 0.99; //1% margin
                            }

                            elem.css('width', currentVideoWidth + 'px');
                            elem.css('height', Math.min(parentHeight, (currentVideoWidth / 16 * 9) + scope.controlsHeight) + 'px');
                        }
                    };

                    //Run once to have the correct size on load
                    scope.fitVideo();

                    //Resize video when page resizes
                    angular.element($window).bind('resize', function() {
                        scope.fitVideo();
                        scope.$apply();
                    });

                    controller.videogularElement = elem;
                    controller.elementScope = angular.element(elem);
                    controller.videoElement = videoElementService.getWrapped();
                    controller.currentTimeElement = [];

                    videoElementService.setSources(scope.sources);

                    addEventListener(controller.videoElement[0], 'waiting', scope.onStartBuffering, false);
                    addEventListener(controller.videoElement[0], 'ended', scope.onComplete, false);
                    addEventListener(controller.videoElement[0], 'playing', scope.onStartPlaying, false);
                    addEventListener(controller.videoElement[0], 'timeupdate', scope.onUpdateTime, false);

                    controller.elementScope.ready(scope.onElementReady);
                    controller.videoElement.ready(scope.onVideoReady);

                    if (!controller.elementScope.find('video').length) {
                        var videoSpot = controller.elementScope.find('video-spot');

                        if (!videoSpot.length) throw new Error('video element requires a <video-spot> tag to be inserted into');

                        controller.elementScope.find('video-spot').append(controller.videoElement);
                    }
                }
            }
        };
    }
]);

