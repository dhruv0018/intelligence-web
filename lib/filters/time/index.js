/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Time
 * @module Time
 */
var Time = angular.module('Time.Filter', []);

/**
 * Time filter.
 * Filters time in milliseconds into colon separated format.
 * @module Time
 * @name time
 * @type {filter}
 */
Time.filter('time', [
    function filter() {

        return function(time) {

            var duration = moment.duration(time, 'seconds');
            var hours = duration.hours();
            var minutes = duration.minutes();
            var seconds = duration.seconds();

            time = minutes + ':' + seconds;
            time = hours ? hours + ':' + time : time;

            return time;
        };
    }
]);

