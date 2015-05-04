/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * CuePoints
 * @module CuePoints
 */
var CuePoints = angular.module('CuePoints', []);

/* Cache the template file */
CuePoints.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('cuepoints.html', require('./template.html'));
    }
]);

/**
 * Sets cue points on scrubber
 * Based on vg-cuepoints (
 * @module CuePoints
 * @name CuePoints
 * @type {directive}
 */
CuePoints.directive('cuePoints', [
    'CUEPOINT_TYPES', 'CUEPOINT_CONSTANTS', 'VideoPlayerEventEmitter', 'VIDEO_PLAYER_EVENTS', 'CuePointEventEmitter', 'CUE_POINT_EVENTS', 'CUE_POINT_TYPE_LABELS',
    function(CUEPOINT_TYPES, CUEPOINT_CONSTANTS, videoPlayerEventEmitter, VIDEO_PLAYER_EVENTS, cuePointEventEmitter, CUE_POINT_EVENTS, CUE_POINT_TYPE_LABELS) {

        var directive = {

            restrict: TO += ELEMENTS,
            link: link,
            scope: {
                'points': '='
            },
            templateUrl: 'cuepoints.html',
            require: ['^videogular']
        };

        function link(scope, element, attributes, controllers) {

            // get controllers
            var API = controllers[0];

            scope.CUEPOINT_TYPES = CUEPOINT_TYPES;

            scope.calcLeft = function(cuepoint) {
                if (API.totalTime === 0) return '-1000';

                var videoLength = API.totalTime / 1000;
                return ((cuepoint.time / videoLength) * 100).toString();
            };

            scope.goToCuePoint = function($event, cuepoint) {

                $event.stopPropagation();
                API.seekTime(cuepoint.time);
            };


            /* Listeners */

            videoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_TIME_UPDATE, onTimeUpdate);
            videoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_SEEKING, onSeeking);

            function onTimeUpdate(event) {

                if (API.mediaElement[0].paused) return;

                cuepointTimeCheck(event.target.currentTime);
            }

            function onSeeking(event) {

                cuepointTimeCheck(event.target.currentTime);
            }

            function cuepointTimeCheck(time) {

                // check each cuepoint time
                for (let index in scope.points) {

                    let cuepoint = scope.points[index];

                    let timeDelta = Math.abs(time - cuepoint.time);

                    if (timeDelta > CUEPOINT_CONSTANTS.MAX_TIME_DELTA) {

                        cuepoint.hit = false;
                    }

                    if (timeDelta <= CUEPOINT_CONSTANTS.MAX_TIME_DELTA && !cuepoint.hit) {

                        // TODO: emit cuepoint events of cuepoint type and time
                        if (cuepoint.type === CUEPOINT_TYPES.TELESTRATION) {

                            // pause, seek, then emit cuepoint event.
                            API.pause();
                            API.seekTime(cuepoint.time);
                            emitOnNextCycle(cuepoint);

                            cuepoint.hit = true;
                            // TODO: Rather than break, handle other points in same time range delta using a queue
                            break;
                        }
                    }
                }
            }

            function emitOnNextCycle(cuepoint) {

                setTimeout(function emitCuePointEvent() {

                    cuePointEventEmitter.emit(CUE_POINT_EVENTS[CUE_POINT_TYPE_LABELS[cuepoint.type]], {'time': cuepoint.time});
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
