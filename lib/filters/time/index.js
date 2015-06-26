/* Fetch angular from the browser scope */
var angular = window.angular;

var moment = require('moment');

/**
 * Time
 * @module Time
 */
var Time = angular.module('Time.Filter', []);

/**
 * Time filter.
 * Filters time in seconds into colon separated format.
 * @module Time
 * @name time
 * @type {filter}
 */
Time.filter('time', [
    'Utilities',
    function filter(utilities) {
        let padZero = utilities.padZero;

        return function(time, pad = false) {
            var duration = moment.duration(time, 'seconds');
            var hours = duration.hours();
            var minutes = duration.minutes();
            minutes = (pad) ? padZero(minutes) : minutes;
            var seconds = duration.seconds();
            seconds = seconds < 0 ? 0 : seconds; //if the buffer is negative, set display to zero
            seconds = (pad) ? padZero(seconds) : seconds; //padding

            time = minutes + ':' + seconds;
            time = hours ? hours + ':' + time : time;

            return time;
        };
    }
]);

/**
 * Time filter.
 * Filters time in milliseconds into colon separated format.
 * @module Time
 * @name time
 * @type {filter}
 */
Time.filter('millisecondsAsHoursMinutesSeconds', [
    'Utilities',
    function filter(utilities) {

        let padZero = utilities.padZero;

        return function(time) {

            let duration = moment.duration(time, 'milliseconds');
            let hours = duration.hours();
            let minutes = duration.minutes();
            let seconds = duration.seconds();

            time = padZero(minutes) + ':' + padZero(seconds);
            time = hours ? padZero(hours) + ':' + time : time;

            return time;
        };
    }
]);

Time.filter('millisecondsAsHours', [
    function filter() {

        return function(time) {

            var duration = moment.duration(time, 'milliseconds');

            return duration.asHours();
        };
    }
]);

Time.filter('hoursAsClock', [
    function filter() {

        return function(time) {

            var hours = Math.floor(time);
            var minutes = Math.floor((time - hours) * 60);

            if (minutes < 10) minutes = '0' + minutes;

            return hours + ':' + minutes;
        };
    }
]);
