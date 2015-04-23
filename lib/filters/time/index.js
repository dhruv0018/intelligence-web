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
    function filter() {

        return function(time) {

            let duration = moment.duration(time, 'seconds');
            let hours = duration.hours();
            let minutes = duration.minutes();
            let seconds = duration.seconds();

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
    function filter() {

        function padZero(time) {

            return (time > 9) ? time : ('0' + time);
        }

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

            let duration = moment.duration(time, 'milliseconds');

            return duration.asHours();
        };
    }
]);

Time.filter('hoursAsClock', [
    function filter() {

        return function(time) {

            let hours = Math.floor(time);
            let minutes = Math.floor((time - hours) * 60);

            if (minutes < 10) minutes = '0' + minutes;

            return hours + ':' + minutes;
        };
    }
]);

function secondsAsMinutes (time) {
    return Math.floor(time / 60);
}

function secondsAsMinutesFilter () {
    return secondsAsMinutes;
}

Time.filter('secondsAsMinutes', secondsAsMinutesFilter);

export {secondsAsMinutes};

function remainingSecondsFromMinuteConversion (time) {
    return time % 60;
}

function remainingSecondsFromMinuteConversionFilter () {
    return remainingSecondsFromMinuteConversion;
}

Time.filter('remainingSecondsFromMinuteConversion', remainingSecondsFromMinuteConversionFilter);

export {remainingSecondsFromMinuteConversion};
