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
 * time of the cuePoint in the video. When the time of the video is within the range of 'MAX_TIME_DELTA', it will
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
CuePoints.directive('cuePoints', [
    'CUEPOINT_CONSTANTS', 'VideoPlayerEventEmitter', 'VIDEO_PLAYER_EVENTS', 'CuePointEventEmitter',
    function(CUEPOINT_CONSTANTS, videoPlayerEventEmitter, VIDEO_PLAYER_EVENTS, cuePointEventEmitter) {

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
            let cuePointTimeRangeLock = false; // Locks out cuePoints gaining control if another already is currently 'hit'

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
                cuePointTimeCheck(cuePoint.time);
            }


            /* Listeners */

            videoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_TIME_UPDATE, onTimeUpdate);
            videoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_SEEKING, onSeeking);

            function onTimeUpdate(event) {

                if (videogularAPI.mediaElement[0].paused) return;

                cuePointTimeCheck(event.target.currentTime);
            }

            function onSeeking(event) {

                cuePointTimeCheck(event.target.currentTime);
            }

            function cuePointTimeCheck(time) {

                // check to unset lock first
                for (let index in $scope.points) {

                    let cuePoint = $scope.points[index];

                    let timeDelta = Math.abs(time - cuePoint.time);

                    if (timeDelta > CUEPOINT_CONSTANTS.MAX_TIME_DELTA && cuePoint.hit) {

                        cuePointTimeRangeLock = false;
                        cuePoint.hit = false;
                    }
                }

                // check if cuepoint in range
                for (let index in $scope.points) {

                    let cuePoint = $scope.points[index];

                    let timeDelta = Math.abs(time - cuePoint.time);

                    if (timeDelta <= CUEPOINT_CONSTANTS.MAX_TIME_DELTA && !cuePoint.hit && !cuePointTimeRangeLock) {

                        // TODO: emit cuePoint events of cuePoint type and time
                        if (cuePoint.type === CUEPOINT_CONSTANTS.TYPES.TELESTRATION) {

                            // pause, seek, then emit cuePoint event.
                            videogularAPI.pause();
                            videogularAPI.seekTime(cuePoint.time);
                            emitOnNextCycle(cuePoint);

                            cuePoint.hit = true;
                            cuePointTimeRangeLock = true;

                            break;
                        }
                    }
                }
            }

            function emitOnNextCycle(cuePoint) {

                setTimeout(function emitCuePointEvent() {

                    cuePointEventEmitter.emit(CUEPOINT_CONSTANTS.TYPES[CUEPOINT_CONSTANTS.LABELS[cuePoint.type]], {'time': cuePoint.time});
                }, 0);
            }

            $scope.$watchCollection('points', function onPointsWatch(newPoints, oldPoints) {

                if (!oldPoints) return;

                cuePointTimeRangeLock = false;

                newPoints.forEach(function copyNewAttributes(newPoint) {

                    let oldPoint = oldPoints.find(function findCondition(oldPoint) {

                        return newPoint.time === oldPoint.time;
                    });

                    // New oldPoint with the same time, thus this is a brand new point
                    // Set it to be 'hit' so that cuepoints don't stop on it immediately
                    if (!oldPoint) {

                        newPoint.hit = true;

                    } else { // copy the oldPoint hit property over

                        newPoint.hit = oldPoint.hit;
                    }
                });
            });

            $scope.$on('$destroy', function onDestroy() {

                videoPlayerEventEmitter.removeListener(VIDEO_PLAYER_EVENTS.ON_TIME_UPDATE, onTimeUpdate);
                videoPlayerEventEmitter.removeListener(VIDEO_PLAYER_EVENTS.ON_SEEKING, onSeeking);
            });
        }

        return directive;
    }
]);
