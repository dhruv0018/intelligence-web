/* Constants */
var TO = '';
var ELEMENTS = 'E';

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
    'com.2fdevs.videogular.plugins.buffering',
    'com.2fdevs.videogular.plugins.poster',
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

Videoplayer.value('VideoPlayerInstance', null);

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
                clipStartTime: '=',
                clipEndTime: '='
            },
            restrict: TO += ELEMENTS,
            link: link,
            controller: 'krossoverVideoplayer.controller',
            templateUrl: 'videoplayer.html'
        };

        function link($scope, element, attributes) {

            $scope.$observe('clipStartTime', function(clipStartTime) {

                $scope.clipStartTime = clipStartTime;
            });

            $scope.$observe('clipEndTime', function(clipEndTime) {

                $scope.clipEndTime = clipEndTime;
            });
        }

        return directive;
    }
]);

Videoplayer.controller('krossoverVideoplayer.controller', [
    '$scope', '$state', '$sce', '$modal', 'VideoPlayerInstance',
    function($scope, $state, $sce, $modal, videoPlayer) {

        $scope.currentTime = 0;
        $scope.totalTime = 0;
        $scope.state = null;
        $scope.volume = 1;
        $scope.isCompleted = false;
        //$scope.API = null;
        console.log($scope);
        console.log('vp', videoPlayer);

        $scope.$watch('clipStartTime', function(newClipTime) {

            console.log('clipStartTime', newClipTime);
            var clipStartTime = newClipTime;

            if (clipStartTime) {
                $scope.currentTime = clipStartTime;
                $scope.mediaFragmentURI = '#t=' + clipStartTime + ',' + $scope.clipEndTime;
            }

            else {

                $scope.mediaFragmentURI = '';
            }

            videoPlayer.videoElement[0].src = videoPlayer.videoElement[0].children[0].src.split('#')[0] + $scope.mediaFragmentURI;

        });

        $scope.$watch('clipEndTime', function(newClipTime) {

            console.log('clipEndTime', newClipTime);
            var clipEndTime = newClipTime;

            if (clipEndTime) {
                $scope.totalTime = clipEndTime;
                $scope.mediaFragmentURI = '#t=' + $scope.clipStartTime + ',' + clipEndTime;
            }

            else {

                $scope.mediaFragmentURI = '';
            }

            videoPlayer.videoElement[0].src = videoPlayer.videoElement[0].children[0].src.split('#')[0] + $scope.mediaFragmentURI;

        });

        $scope.buildSrcUri = function(source) {

            var uri = source.src + $scope.mediaFragmentURI;

            return $sce.trustAsResourceUri(uri);
        };

        $scope.onPlayerReady = function(API) {
            console.log('onPlayerReady', API);
            videoPlayer = API;
        };

        $scope.onCompleteVideo = function() {

            $scope.isCompleted = true;
        };

        $scope.onUpdateState = function(state) {

            $scope.state = state;
        };

        /*$scope.onUpdateTime = function(currentTime, totalTime) {

            $scope.currentTime = currentTime;
            $scope.totalTime = totalTime;
        };*/

        $scope.onUpdateVolume = function(volume) {

            $scope.volume = volume;
        };

        $scope.onUpdateSize = function(width, height) {

            $scope.config.width = width;
            $scope.config.height = height;
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
            theme: {
                url: 'styles.css'
            }
        };
    }
]);

