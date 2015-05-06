/* Constants */
let TO = '';
let ELEMENTS = 'E';

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
 * Sets cue points on scrubber
 * Based on vg-cuePoints (
 * @module CuePoints
 * @name CuePoints
 * @type {directive}
 */
CuePoints.directive('cuePoints', [
    'CUEPOINT_CONSTANTS', 'VideoPlayerEventEmitter', 'VIDEO_PLAYER_EVENTS', 'CuePointEventEmitter',
    function(CUEPOINT_CONSTANTS, videoPlayerEventEmitter, VIDEO_PLAYER_EVENTS, cuePointEventEmitter) {

        let directive = {

            restrict: TO += ELEMENTS,

            link: link,

            scope: {
                'points': '='
            },

            templateUrl: 'cuePoints.html',

            require: ['^videogular']
        };

        function link(scope, element, attributes, controllers) {

            // get controllers
            let videogularAPI = controllers[0];

            scope.CUEPOINT_CONSTANTS = CUEPOINT_CONSTANTS;

            scope.calcLeft = function(cuePoint) {

                if (videogularAPI.totalTime === 0) return '-1000';

                let videoLength = videogularAPI.totalTime / 1000;

                return ((cuePoint.time / videoLength) * 100).toString();
            };

            scope.onMousedown = function onMousedown($event, cuePoint) {

                goToCuePoint($event, cuePoint);
            };

            function goToCuePoint($event, cuePoint) {

                $event.stopPropagation();
                videogularAPI.seekTime(cuePoint.time);
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

                // check each cuePoint time
                for (let index in scope.points) {

                    let cuePoint = scope.points[index];

                    let timeDelta = Math.abs(time - cuePoint.time);

                    if (timeDelta > CUEPOINT_CONSTANTS.MAX_TIME_DELTA) {

                        cuePoint.hit = false;
                    }

                    if (timeDelta <= CUEPOINT_CONSTANTS.MAX_TIME_DELTA && !cuePoint.hit) {

                        // TODO: emit cuePoint events of cuePoint type and time
                        if (cuePoint.type === CUEPOINT_CONSTANTS.TYPES.TELESTRATION) {

                            // pause, seek, then emit cuePoint event.
                            videogularAPI.pause();
                            videogularAPI.seekTime(cuePoint.time);
                            emitOnNextCycle(cuePoint);

                            cuePoint.hit = true;
                            // TODO: Rather than break, handle other points in same time range delta using a queue
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

            scope.$watch('points', function onPointsWatch(newPoints, oldPoints) {

                oldPoints.forEach(function copyNewAttributes(oldPoint) {

                    let matches = newPoints.filter(function findCondition(newPoint) {

                        return newPoint.time === oldPoint.time;
                    });

                    if (matches) {

                        matches.forEach(function copyHits(match) {

                            // copy over temporary attribute if points are updated
                            match.hit = oldPoint.hit;
                        });
                    }
                });
            });

            scope.$on('$destroy', function onDestroy() {

                videoPlayerEventEmitter.removeListener(VIDEO_PLAYER_EVENTS.ON_TIME_UPDATE, onTimeUpdate);
                videoPlayerEventEmitter.removeListener(VIDEO_PLAYER_EVENTS.ON_SEEKING, onSeeking);
            });
        }

        return directive;
    }
]);
