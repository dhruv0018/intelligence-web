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
            let duration = moment.duration(time, 'seconds');
            let hours = duration.hours();
            let minutes = duration.minutes();
            minutes = (pad) ? padZero(minutes) : minutes;
            let seconds = duration.seconds();
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
 * Filters time in seconds into colon separated format.
 * @module Time
 * @name secondsAsHoursMinutesSeconds
 * @type {filter}
 */
Time.filter('secondsAsHoursMinutesSeconds', [
    'Utilities',
    function filter(utilities) {

        let padZero = utilities.padZero;

        return function (time) {

            let duration = moment.duration(time, 'seconds');
            let hours    = duration.hours();
            let minutes  = duration.minutes();
            let seconds  = duration.seconds();

            time = padZero(minutes) + ':' + padZero(seconds);
            time = hours ? padZero(hours) + ':' + time : time;

            return time;
        };
    }
]);

/**
 * Time filter.
 * Filters time in milliseconds into colon separated format.
 * @module Time
 * @name millisecondsAsDaysHoursMinutes
 * @type {filter}
 */
Time.filter('millisecondsAsDaysHoursMinutes', [
    'Utilities',
    function filter(utilities) {

        let padZero = utilities.padZero;

        return function(time) {

            let duration = moment.duration(time, 'milliseconds');
            let days = Math.abs(duration.days());
            let hours = Math.abs(duration.hours());
            let minutes = Math.abs(duration.minutes());

            time = hours + 'h ' + padZero(minutes) + 'm ';
            time = days ? days + 'd ' + time : time;

            if(duration.milliseconds() < 0) {
                time = '-' + time;
            }
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

            let duration = moment.duration(time, 'milliseconds');
            return duration.asHours();
        };
    }
]);

Time.filter('hoursAsClock', [
    function filter() {

        return function(time) {
            let hours = 0,
                minutes = 0,
                displayTime = '',
                displayMinutes = '',
                negativeHours = false;

            negativeHours = time < 0 ? true : false;
            hours = negativeHours ? Math.ceil(time) : Math.floor(time);
            minutes = Math.abs(Math.floor((time - hours) * 60));

            let hourReached = minutes >= 60;
            if (hourReached) {
                minutes = 0;
                hours = negativeHours ? hours - 1 : hours + 1;
            }

            displayMinutes = minutes < 10 ? `0${minutes}`: minutes;
            displayTime = `${hours}:${displayMinutes}`;

            return displayTime;
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

function secondsAsMinutesAndSeconds (time) {
    let minutes = secondsAsMinutes(time);
    let seconds = remainingSecondsFromMinuteConversion(time);

    if (seconds < 10) seconds = '0' + seconds;

    return minutes + ':' + seconds;
}

function secondsAsMinutesAndSecondsFilter () {
    return secondsAsMinutesAndSeconds;
}

Time.filter('secondsAsMinutesAndSeconds', secondsAsMinutesAndSecondsFilter);

export {secondsAsMinutesAndSeconds};
