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
    //ON_UPDATE_THEME: 'onVgUpdateTheme',
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
            if (navigator.userAgent.match(/Firefox/i)) {
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
                playerWidth: '=vgWidth',
                playerHeight: '=vgHeight',
                //theme: '=vgTheme',
                autoPlay: '=vgAutoplay',
                responsive: '=vgResponsive',
                stretch: '=vgStretch',
                vgComplete: '&',
                vgUpdateVolume: '&',
                vgUpdateTime: '&',
                vgUpdateSize: '&',
                vgUpdateState: '&',
                vgPlayerReady: '&',
                vgChangeSource: '&',
                sources: '=vgSources'
            },
            controller: ['$scope', function($scope) {
                //var currentTheme = null;
                var currentWidth = null;
                var currentHeight = null;

                var currentStretch = $scope.stretch;
                var playerWidth = 0;
                var playerHeight = 0;
                var isFullScreenPressed = false;
                var isFullScreen = false;
                var isMetaDataLoaded = false;
                var isElementReady = false;
                var isVideoReady = false;
                var isPlayerReady = false;
                var isResponsive = false;
                var self = this;

                var vgCompleteCallBack = $scope.vgComplete();
                var vgUpdateVolumeCallBack = $scope.vgUpdateVolume();
                var vgUpdateTimeCallBack = $scope.vgUpdateTime();
                var vgUpdateSizeCallBack = $scope.vgUpdateSize();
                var vgUpdateStateCallBack = $scope.vgUpdateState();
                var vgPlayerReadyCallBack = $scope.vgPlayerReady();
                var vgChangeSourceCallBack = $scope.vgChangeSource();

                $scope.currentState = VG_STATES.STOP;

                // PUBLIC $API
                this.$on = function() {
                    $scope.$on.apply($scope, arguments);
                };

                this.isPlayerReady = function() {
                    return isPlayerReady;
                };

                this.seekTime = function(value, byPercent) {
                    var second;
                    if (byPercent) {
                        second = value * this.videoElement[0].duration / 100;
                        this.videoElement[0].currentTime = second;
                    }
                    else {
                        second = value;
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
                    this.videoElementService.clearSources();
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
                        if (isFullScreen) {
                            this.videogularElement.removeClass('fullscreen');
                            this.videogularElement.css('z-index', 0);
                        }
                        else {
                            this.videogularElement.addClass('fullscreen');
                            this.videogularElement.css('z-index', VG_UTILS.getZIndex());
                        }

                        isFullScreen = !isFullScreen;

                        $scope.updateSize();
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

                // this.updateTheme = function(value) {
                //     if (currentTheme) {
                //         // Remove previous theme
                //         var links = document.getElementsByTagName('link');
                //         for (var i = 0, l = links.length; i < l; i++) {
                //             if (links[i].outerHTML.indexOf(currentTheme) >= 0) {
                //                 links[i].parentNode.removeChild(links[i]);
                //             }
                //         }
                //     }

                //     if (value) {
                //         var headElem = angular.element(document).find('head');
                //         //headElem.append('<link rel="stylesheet" href=""' + value + '>');

                //         currentTheme = value;
                //     }
                // };

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

                // PRIVATE FUNCTIONS
                $scope.API = this;

                $scope.init = function() {
                    //self.updateTheme($scope.theme);
                    $scope.addBindings();

                    if ($scope.playerWidth === undefined || $scope.playerHeight === undefined || $scope.responsive) {
                        isResponsive = true;
                        angular.element($window).bind('resize', $scope.onResizeBrowser);
                    }
                    else {
                        playerWidth = $scope.playerWidth;
                        playerHeight = $scope.playerHeight;

                        self.setSize(playerWidth, playerHeight);
                    }

                    if (angular.element($window)[0].fullScreenAPI) {
                        addEventListener(document, angular.element($window)[0].fullScreenAPI.onchange, $scope.onFullScreenChange);
                    }
                };

                $scope.addBindings = function() {
                    $scope.$watch('playerWidth', function(newValue, oldValue) {
                        if (newValue != oldValue) {
                            self.setSize(newValue, currentHeight);
                        }
                    });

                    $scope.$watch('playerHeight', function(newValue, oldValue) {
                        if (newValue != oldValue) {
                            self.setSize(currentWidth, newValue);
                        }
                    });

                    // $scope.$watch('theme', function(newValue, oldValue) {
                    //     if (newValue != oldValue) {
                    //         self.updateTheme(newValue);
                    //     }
                    // });

                    $scope.$watch('stretch', function(newValue, oldValue) {
                        if (newValue != oldValue) {
                            self.updateStretch(newValue);
                        }
                    });

                    $scope.$watch('autoPlay', function(newValue, oldValue) {
                        if (newValue != oldValue) {
                            self.play();
                        }
                    });

                    $scope.$watch('responsive', function(newValue, oldValue) {
                        if (newValue != oldValue) {
                            isResponsive = newValue;

                            if (isResponsive) {
                                angular.element($window).bind('resize', $scope.onResizeBrowser);
                                $scope.onResizeBrowser();
                            }
                            else {
                                angular.element($window).unbind('resize', $scope.onResizeBrowser);
                                currentWidth = $scope.playerWidth;
                                currentHeight = $scope.playerHeight;
                                $scope.updateSize();
                            }
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
                    $scope.updateSize();
                    if ($scope.vgPlayerReady()) {
                        vgPlayerReadyCallBack = $scope.vgPlayerReady();
                        vgPlayerReadyCallBack(self);
                    }
                    $scope.$emit(VG_EVENTS.ON_PLAYER_READY);

                    if ($scope.autoPlay && !VG_UTILS.isMobileDevice() || $scope.currentState === VG_STATES.PLAY) self.play();
                };

                $scope.updateSize = function() {
                    if (isPlayerReady) {
                        var videoSize;
                        var videoTop;
                        var videoLeft;

                        if (angular.element($window)[0].fullScreenAPI && angular.element($window)[0].fullScreenAPI.isFullScreen() || isFullScreen) {
                            self.elementScope.css('width', parseInt(window.screen.width, 10) + 'px');
                            self.elementScope.css('height', parseInt(window.screen.height, 10) + 'px');

                            videoSize = $scope.getVideoSize(window.screen.width, window.screen.height);

                            if (isFullScreen) {
                                playerWidth = $window.innerWidth;
                                playerHeight = $window.innerHeight;
                            }
                            else {
                                playerWidth = $window.screen.width;
                                playerHeight = $window.screen.height;
                            }
                        }
                        else {
                            self.elementScope.css('width', parseInt(currentWidth, 10) + 'px');
                            self.elementScope.css('height', parseInt(currentHeight, 10) + 'px');

                            videoSize = $scope.getVideoSize(currentWidth, currentHeight);

                            playerWidth = currentWidth;
                            playerHeight = currentHeight;
                        }

                        if (currentHeight === 0 || isNaN(currentHeight)) {
                            playerWidth = videoSize.width;
                            playerHeight = videoSize.height;
                        }

                        if (videoSize.width === 0 || isNaN(videoSize.width)) videoSize.width = currentWidth;
                        if (videoSize.height === 0 || isNaN(videoSize.height)) videoSize.height = currentHeight;

                        videoLeft = (playerWidth - videoSize.width) / 2;
                        videoTop = (playerHeight - videoSize.height) / 2;

                        self.videoElement.attr('width', parseInt(videoSize.width, 10));
                        self.videoElement.attr('height', parseInt(videoSize.height, 10));
                        self.videoElement.css('width', parseInt(videoSize.width, 10) + 'px');
                        self.videoElement.css('height', parseInt(videoSize.height, 10) + 'px');
                        self.videoElement.css('top', videoTop + 'px');
                        self.videoElement.css('left', videoLeft + 'px');

                        self.elementScope.css('width', parseInt(playerWidth, 10) + 'px');
                        self.elementScope.css('height', parseInt(playerHeight, 10) + 'px');

                        if ($scope.vgUpdateSize()) {
                            vgUpdateSizeCallBack = $scope.vgUpdateSize();
                            vgUpdateSizeCallBack(playerWidth, playerHeight);
                        }

                        $scope.$emit(VG_EVENTS.ON_UPDATE_SIZE, [playerWidth, playerHeight]);
                    }
                };

                $scope.onResizeBrowser = function() {
                    var percentWidth = self.elementScope[0].parentNode.clientWidth * 100 / self.videoElement[0].videoWidth;
                    var videoHeight = self.videoElement[0].videoHeight * percentWidth / 100;

                    currentWidth = self.elementScope[0].parentNode.clientWidth;
                    currentHeight = videoHeight;

                    $scope.updateSize();
                };

                $scope.onFullScreenChange = function(event) {
                    if (angular.element($window)[0].fullScreenAPI.isFullScreen()) {
                        $scope.$emit(VG_EVENTS.ON_ENTER_FULLSCREEN);
                    }
                    else {
                        $scope.$emit(VG_EVENTS.ON_EXIT_FULLSCREEN);
                    }

                    $scope.updateSize();
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
                    if ($scope.vgUpdateTime()) {
                        vgUpdateTimeCallBack = $scope.vgUpdateTime();
                        vgUpdateTimeCallBack(event.target.currentTime, event.target.duration);
                    }

                    $scope.$emit(VG_EVENTS.ON_UPDATE_TIME, [event.target.currentTime, event.target.duration]);
                };

                $scope.getVideoSize = function(w, h) {
                    var percentageWidth;
                    var percentageHeight;
                    var result = {};
                    var wider = self.videoElement[0].videoWidth / self.videoElement[0].videoHeight > w / h;
                    result.width = w;
                    result.height = h;

                    if (currentStretch == 'fit' && wider || currentStretch == 'fill' && !wider) {
                        percentageWidth = w * 100 / self.videoElement[0].videoWidth;
                        result.height = self.videoElement[0].videoHeight * percentageWidth / 100;
                    } else if (currentStretch == 'fill' && wider || currentStretch == 'fit' && !wider) {
                        percentageHeight = h * 100 / self.videoElement[0].videoHeight;
                        result.width = self.videoElement[0].videoWidth * percentageHeight / 100;
                    } else {
                        result.width = self.videoElement[0].videoWidth;
                        result.height = self.videoElement[0].videoHeight;
                    }

                    // Metadata has not been loaded or any problem has been happened
                    if (result.height === 0 || isNaN(result.height)) {
                        result.width = self.elementScope[0].parentElement.clientWidth;
                        result.height = result.width * 9 / 16;
                    }

                    return result;
                };

                $scope.init();

                $scope.$on('$destroy', function() {
                    removeEventListeners();
                });
            }],
            link: {
                pre: function(scope, elem, attr, controller) {
                    controller.videogularElement = elem;
                    controller.elementScope = angular.element(elem);
                    //controller.videoElement = controller.elementScope.find('video');
                    controller.videoElement = videoElementService.getWrapped();
                    videoElementService.setSources(scope.sources);

                    addEventListener(controller.videoElement[0], 'waiting', scope.onStartBuffering, false);
                    addEventListener(controller.videoElement[0], 'ended', scope.onComplete, false);
                    addEventListener(controller.videoElement[0], 'playing', scope.onStartPlaying, false);
                    addEventListener(controller.videoElement[0], 'timeupdate', scope.onUpdateTime, false);

                    controller.elementScope.ready(scope.onElementReady);
                    controller.videoElement.ready(scope.onVideoReady);

                    if (!controller.elementScope.find('video').length) {
                        controller.elementScope.find('video-spot').append(controller.videoElement);
                    }
                }
            }
        };
    }
]);

videogular.directive('vgSrc', [
    'VG_EVENTS', 'VG_UTILS',
    function(VG_EVENTS, VG_UTILS) {
        return {
            restrict: 'A',
            link: {
                pre: function(scope, elem, attr) {
                    var element = elem;
                    var sources;
                    var canPlay;

                    function changeSource() {
                        canPlay = '';

                        // It's a cool browser
                        if (element[0].canPlayType) {
                            for (var i = 0, l = sources.length; i < l; i++) {
                                canPlay = element[0].canPlayType(sources[i].type);

                                if (canPlay == 'maybe' || canPlay == 'probably') {
                                    element.attr('src', sources[i].src);
                                    element.attr('type', sources[i].type);
                                    break;
                                }
                            }
                        }
                        // It's a crappy browser and it doesn't deserve any respect
                        else {
                            // Get H264 or the first one
                            element.attr('src', sources[0].src);
                            element.attr('type', sources[0].type);
                        }

                        if (canPlay === '') {
                            scope.$broadcast(VG_EVENTS.ON_ERROR, {type: 'Can\'t play file'});
                        }
                    }

                    scope.$watch(attr.vgSrc, function(newValue, oldValue) {
                        if (!sources || newValue != oldValue) {
                            sources = newValue;
                            changeSource();
                        }
                    });
                }
            }
        };
    }
]);
