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

/**
 * Videoplayer directive.
 * @module Videoplayer
 * @name KrossoverVideoplayer
 * @type {Directive}
 */
Videoplayer.directive('krossoverVideoplayer', [
    function() {

        var directive = {

            restrict: TO += ELEMENTS,
            controller: 'Videoplayer.controller',
            templateUrl: 'videoplayer.html'
        };

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
    '$scope', '$state', '$sce', '$modal',
    function controller($scope, $state, $sce, $modal) {

        $scope.currentTime = 0;
        $scope.totalTime = 0;
        $scope.state = null;
        $scope.volume = 1;
        $scope.isCompleted = false;
        $scope.API = null;

        $scope.onPlayerReady = function(API) {

            $scope.VideoPlayer = API;
        };

        $scope.onCompleteVideo = function() {

            $scope.isCompleted = true;
        };

        $scope.onUpdateState = function(state) {

            $scope.state = state;
        };

        $scope.onUpdateTime = function(currentTime, totalTime) {

            $scope.currentTime = currentTime;
            $scope.totalTime = totalTime;
        };

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

