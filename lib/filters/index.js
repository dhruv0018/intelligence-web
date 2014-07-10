/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Filters module.
 * @module Filters
 */
var Filters = angular.module('Filters', [
]);

Filters.filter('secondsToTime', function() {
    return function(time) {

        if (!time || time < 0) return '00:00';

        var mm = window.Math.floor(time / 60);
        var ss = window.Math.floor(time - (mm * 60));
        var mins = mm < 10 ? '0' + mm : mm;
        var secs = ss < 10 ? '0' + ss : ss;

        return mins + ':' + secs;
    };
});

