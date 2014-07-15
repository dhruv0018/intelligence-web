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

        var ss = time % 60;
        ss = (ss < 10) ? '0' + ss : ss;
        var mm = ((time - ss) / 60) % 60;
        mm = (mm < 10) ? '0' + mm : mm;
        var hh = (time - ss - (mm * 60)) / (60 * 60);
        return ((hh > 0) ? (hh + ':') : '') + mm + ':' + ss;
    };
});

