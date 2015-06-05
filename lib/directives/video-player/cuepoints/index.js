/* Constants */
let TO = '';
const ELEMENTS = 'E';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * CuePoints
 * @module CuePoints
 */
const CuePoints = angular.module('CuePoints', []);

/* Cache the template file */
CuePoints.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('cuePoints.html', require('./template.html'));
    }
]);

/**
 * @module CuePoints
 * @name CuePoints
 *
 * @ngdoc directive
 * @type {directive}
 * @name cuePoints
 *
 * @description
 * Displays a `cuePoint` marker on the videogular scrub-bar. These cuePoints can be clicked on, which will seekTo the
 * time of the cuePoint in the video. When the time of the video is within the range of 'MAX_TIME_TAIL_DELTA', it will
 * consider the cuePoint 'hit', then it will seekTo the actual time of the cuePoint, and emit an event for subscribers
 * to listen to.
 *
 * Please note, this directive is based on videogular's vg-cuePoints directive.
 *
 * @scope
 *
 * @param {object=} points The collection of cuePoints that for the currently active video.
 * @property {number} points.time The time (in seconds) that the cuePoint resides at.
 * @property {number} points.type The type of cuepoint from the CUEPOINT_CONSTANTS.TYPES enum
 */
CuePoints.directive('cuePoints', CuePointsDirective);

CuePointsDirective.$inject = [
    '$timeout',
    'CUEPOINT_CONSTANTS',
    'VideoPlayerEventEmitter',
    'VIDEO_PLAYER_EVENTS',
    'CuePointEventEmitter',
    'VideoPerformanceTimer'
];

function CuePointsDirective(
    $timeout,
    CUEPOINT_CONSTANTS,
    videoPlayerEventEmitter,
    VIDEO_PLAYER_EVENTS,
    cuePointEventEmitter,
    VideoPerformanceTimer
) {

    let directive = {

        restrict: TO += ELEMENTS,

        link: cuePointLink,

        scope: {
            'points': '='
        },

        templateUrl: 'cuePoints.html',

        require: ['^videogular']
    };

    function cuePointLink($scope, $element, $attributes, $controllers) {

        // get controllers
        const videogularAPI = $controllers[0];

        // create new video performance timer
        let videoElement = videogularAPI.mediaElement[0];

        const videoPerformanceTimer = VideoPerformanceTimer.getInstance(videoElement);

        let currentCuePointIndex = 0;
        let isCuePointClicked = false;
        let isCuePointHit = false;

        $scope.CUEPOINT_CONSTANTS = CUEPOINT_CONSTANTS;

        $scope.calcLeft = function calcLeft(cuePoint) {

            // TODO: When will the totalTime be 0? Why are the cuePoints off screen if there is no time?
            if (videogularAPI.totalTime === 0) return '-1000';

            let videoLengthInSeconds = videogularAPI.totalTime / 1000;
            let cuePointPercentageOfVideoLength = (cuePoint.time / videoLengthInSeconds) * 100;

            return cuePointPercentageOfVideoLength.toString();
        };

        $scope.onMousedown = function onMousedown($event, cuePoint) {

            goToCuePoint($event, cuePoint);
        };

        function goToCuePoint($event, cuePoint) {

            $event.stopPropagation();

            // set the isCuePointClicked flag
            isCuePointClicked = true;

            // update the current cuePoint index
            currentCuePointIndex = $scope.points.indexOf(cuePoint);

            // seek to the time
            videoElement.currentTime = cuePoint.time;
        }

        function updateCurrentCuePointIndex(eventOrTimeSeconds) {

            // wait until flags are off to update the cuepoint index
            if (isCuePointClicked || isCuePointHit) return;

            let currentTimeSeconds = eventOrTimeSeconds.target ? eventOrTimeSeconds.target.currentTime : eventOrTimeSeconds;

            // `points` is sorted in ascending order
            for (let index in $scope.points) {

                let cuePoint = $scope.points[index];

                if (currentTimeSeconds < cuePoint.time) {

                    currentCuePointIndex = index;
                    break;
                }
            }
        }

        /* Listeners */

        videoElement.addEventListener('seeked', updateCurrentCuePointIndex);

        Object.observe(videoPerformanceTimer.observableTime, function onObserveEvent(timeObserveObject) {

            // IMPORTANT! This keeps the telestrations from being skipped. DO NOT EDIT.
            if (!isCuePointClicked && (isCuePointHit || videoElement.paused)) return;

            let currentTimeSeconds = timeObserveObject[0].object.currentTime / 1000;

            // ensure that the currentCuepointIndex is correct in case a cuePoint is skipped
            updateCurrentCuePointIndex(currentTimeSeconds);

            let cuePoint = $scope.points[currentCuePointIndex];

            // index out of bounds
            if (!cuePoint) return;

            if (isCuePointClicked) {

                cuePointHit(cuePoint);

                // unset isCuePointClicked flag
                isCuePointClicked = false;

            } else if (cuePointHitTimeCheck(cuePoint, currentTimeSeconds)) {

                cuePointHit(cuePoint);
            }
        });

        function cuePointHitTimeCheck(cuePoint, timeSeconds) {

            let lowerTailTime = cuePoint.time - CUEPOINT_CONSTANTS.MAX_TIME_TAIL_DELTA;

            if (timeSeconds < cuePoint.time && timeSeconds >= lowerTailTime) {

                // cuePoint is hit (i.e. within the TIME DELTA and hasn't been hit yet)
                return true;
            }
        }

        let boundVideoCanPlayCurrentTime;

        function cuePointHit(cuePoint) {

            isCuePointHit = true;

            // pause
            videogularAPI.pause();

            // update the time to the actual cuepoint
            videoElement.currentTime = cuePoint.time;

            // wait until the video has time to seek to the current time as set above
            boundVideoCanPlayCurrentTime = videoCanPlayCurrentTime.bind(this, cuePoint);
            videoElement.addEventListener('canplay', boundVideoCanPlayCurrentTime);

            // increment the current cuepoint index
            currentCuePointIndex++;
        }

        function runFunctionOnNextCycle(callback, delay = 0) {

            $timeout(callback, delay);
        }

        function videoCanPlayCurrentTime(cuePoint) {

            /* NOTE: This is a hack (play/pause) to update the video's frame (specifically in chrome) once
            * the video's currentTime has been updated and the video `canplay` */
            videoElement.play();
            videoElement.pause();

            videoElement.removeEventListener('canplay', boundVideoCanPlayCurrentTime);

            runFunctionOnNextCycle(emitCuePointEvent.bind(this, cuePoint));
        }

        function emitCuePointEvent(cuePoint) {

            cuePointEventEmitter.emit(CUEPOINT_CONSTANTS.TYPES[CUEPOINT_CONSTANTS.LABELS[cuePoint.type]], {'time': cuePoint.time});

            // unset isCuePointHit flag
            isCuePointHit = false;
        }

        $scope.$watchCollection('points', function onPointsWatch(newPoints, oldPoints) {

            currentCuePointIndex = 0;

            // sort the cuepoints in ascending order based on time
            $scope.points.sort((firstCuePoint, secondCuePoint) => {

                return firstCuePoint.time - secondCuePoint.time;
            });
        });

        $scope.$on('$destroy', function onDestroy() {

            videoPerformanceTimer.cleanup();
            videoElement.removeEventListener('seeked', updateCurrentCuePointIndex);
        });
    }

    return directive;
}
