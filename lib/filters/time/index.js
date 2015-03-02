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
 * Filters time in milliseconds into colon separated format.
 * @module Time
 * @name time
 * @type {filter}
 */
Time.filter('time', [
    function filter() {

        return function(time) {

            var duration = moment.duration(time, 'milliseconds');
            var hours = duration.hours();
            var minutes = duration.minutes();
            var seconds = duration.seconds();

            time = minutes + ':' + seconds;
            time = hours ? hours + ':' + time : time;

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
